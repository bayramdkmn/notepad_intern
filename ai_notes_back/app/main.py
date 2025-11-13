from fastapi import FastAPI,Request
import time
from app.crud import users
from app.crud import notes
from app.model import Base
from app.crud import tags
from app.database import engine
from app.crud.notes import delete_old_soft_deleted_notes
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi.middleware.cors import CORSMiddleware

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
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(round(process_time, 4))
    print(f"{request.method} {request.url.path} took {process_time:.4f} seconds")
    return response

app.include_router(users.router)
app.include_router(notes.router)
app.include_router(tags.router)


scheduler = BackgroundScheduler()
scheduler.add_job(delete_old_soft_deleted_notes, 'interval', days=1)
scheduler.start()
