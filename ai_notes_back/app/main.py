from fastapi import FastAPI, Request, HTTPException
import time
from app.crud import users
from app.crud import notes
from app.core.model import Base
from app.crud import tags
from app.core.database import engine
from app.crud.notes import delete_old_soft_deleted_notes
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi.middleware.cors import CORSMiddleware
import os

from starlette.datastructures import State

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001"
]

app = FastAPI()
app.state = State()

app.state.metrics = {
    "total_requests": 0,
    "total_time": 0.0,
    "by_path": {},
    "errors": 0
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/check/heathy/")
async def healthy():
    return {"status":"healthy"}

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    try:
        response = await call_next(request)
    except Exception as exc:
        process_time = time.perf_counter() - start_time
        app.state.metrics["total_requests"] += 1
        app.state.metrics["total_time"] += process_time
        path = request.url.path
        entry = app.state.metrics["by_path"].setdefault(path, {"count": 0, "time": 0.0})
        entry["count"] += 1
        entry["time"] += process_time
        app.state.metrics["errors"] += 1
        raise HTTPException(status_code=400,detail=exc)

    process_time = time.perf_counter() - start_time
    app.state.metrics["total_requests"] += 1
    app.state.metrics["total_time"] += process_time
    path = request.url.path
    entry = app.state.metrics["by_path"].setdefault(path, {"count": 0, "time": 0.0})
    entry["count"] += 1
    entry["time"] += process_time

    response.headers["X-Process-Time"] = str(round(process_time, 4))
    return response

app.include_router(users.router)
app.include_router(notes.router)
app.include_router(tags.router)


scheduler = BackgroundScheduler()
scheduler.add_job(delete_old_soft_deleted_notes, 'interval', days=1)
scheduler.start()


@app.get('/system/health/detailed')
async def system_health_detailed():
    result = {}
    redis_url = os.getenv('REDIS_URL') or os.getenv('REDIS_URI')
    if redis_url:
        try:
            import redis
            r = redis.Redis.from_url(redis_url)
            pong = r.ping()
            result['cache'] = 'ok' if pong else 'unavailable'
        except Exception as e:
            result['cache'] = f'error: {str(e)}'
    else:
        result['cache'] = 'not configured'
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        result['db'] = 'ok'
    except Exception as e:
        result['db'] = f'error: {str(e)}'

    broker = os.getenv('CELERY_BROKER_URL') or os.getenv('BROKER_URL')
    if broker:
        result['queue'] = 'configured'
    else:
        result['queue'] = 'not configured'

    result['rate_limit'] = 'not configured'

    return result


@app.get('/system/metrics')
async def system_metrics():
    m = app.state.metrics
    total = m.get('total_requests', 0)
    avg_time = (m.get('total_time', 0.0) / total) if total > 0 else 0.0

    most_used = None
    by_path_summary = []
    if m.get('by_path'):
        for p, v in m['by_path'].items():
            avg_p = (v['time'] / v['count']) if v['count'] > 0 else 0.0
            by_path_summary.append({
                'path': p,
                'count': v['count'],
                'average_time': avg_p
            })
        most_used = max(m['by_path'].items(), key=lambda x: x[1]['count'])[0]

    return {
        'total_requests': total,
        'average_response_time': avg_time,
        'error_count': m.get('errors', 0),
        'most_used_endpoint': most_used,
        'paths': by_path_summary
    }
