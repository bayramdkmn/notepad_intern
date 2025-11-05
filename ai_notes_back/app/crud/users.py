import uuid
from fastapi import APIRouter,HTTPException,Depends,Body
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm,OAuth2PasswordBearer
from ..schemes import UserRequest,Token,PasswordResetRequest,UpdateUserRequest,RequestPasswordResetSchema,ResetWithTokenSchema
from ..model import Users,TokenBlacklist,Token,PasswordResetToken
from passlib.context import CryptContext
from typing import Annotated
import datetime
from datetime import timezone,timedelta,datetime
from jose import jwt,JWTError
from ..database import get_db

router = APIRouter(
    prefix = "/auth",
    tags = ["auth"]
)

ACCESS_TOKEN_SECRET_KEY = "OVN19q3VLgRkSpzqg6ulk9qTxC8IgIObJqS8s1eZQqW"
REFRESH_TOKEN_SECRET_KEY = "KOjFDcSbbXyuCF6h2HqKwLh3TSLguh5fKXKCvlxOO7t"
ALGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=["bcrypt"],deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/user/login')

DEV_MODE = True

def create_access_token(email:str,user_id:int,role:str,expires_delta:timedelta):
    encode = {
        'sub':email,
        'id':user_id,
        'type':'access_token',
        'role': role,
        'iat':datetime.now(timezone.utc)
    }
    expire = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expire})
    return jwt.encode(encode,ACCESS_TOKEN_SECRET_KEY,algorithm=ALGORITHM)

def create_refresh_token(email:str,user_id:int,role:str):
    jti = str(uuid.uuid4())
    encode = {
        'sub':email,
        'id':user_id,
        'type':'refresh_token',
        'role':role,
        'jti':jti,
        'iat':datetime.now(timezone.utc)
    }
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    encode.update({"exp":expire})
    return jwt.encode(encode,REFRESH_TOKEN_SECRET_KEY,algorithm=ALGORITHM)

async def get_current_user( token : Annotated[str,Depends(oauth2_bearer)],db:Session=Depends(get_db)):
    try:
        payload = jwt.decode(token,ACCESS_TOKEN_SECRET_KEY,algorithms=ALGORITHM)
        email : str = payload.get("sub")
        user_id :int = payload.get('id')
        if email is None or user_id is None:
            raise HTTPException(status_code=401,detail="Could not validate user.")
        blacklisted = db.query(TokenBlacklist).filter_by(token=token).first()
        if blacklisted:
            raise HTTPException(status_code=401, detail="Token has been revoked")
        return {'email':email,"id":user_id}
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate user.")

user_dependency = Annotated[dict,Depends(get_current_user)]

@router.post("/user/register/")
async def register(request:UserRequest,db:Session=Depends(get_db)):
    user = Users(
        name = request.name,
        surname = request.surname,
        username = request.username,
        email = request.email,
        password_hash = bcrypt_context.hash(request.password_hash),
        role = request.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/user/login/")
async def login(form_data: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):

    user = db.query(Users).filter(Users.email.__eq__(form_data.username)).first()
    if not user or not bcrypt_context.verify(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="User or password is incorrect")

    token = create_access_token(user.email, user.id, user.role,timedelta(minutes=20))
    refresh_token = create_refresh_token(user.email, user.id,user.role)

    decoded_refresh = jwt.decode(refresh_token, REFRESH_TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
    jti = decoded_refresh.get("jti")
    expires_at = datetime.fromtimestamp(decoded_refresh["exp"], tz=timezone.utc)

    refresh_token_type = Token(
        user_id = user.id,
        token = refresh_token,
        token_type="refresh_token",
        expires_at = expires_at,
        jti = jti
    )

    db.add(refresh_token_type)
    db.commit()

    return {
        "access_token": token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh-token/")
async def refresh_token_endpoint(refresh_token: str = Body(..., embed=True),  db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, REFRESH_TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(401, detail="Invalid refresh token")

    if db.query(TokenBlacklist).filter_by(jti=payload['jti']).first():
        raise HTTPException(401, detail="Token revoked")

    user = db.query(Users).filter_by(id=payload['id']).first()
    if not user:
        raise HTTPException(404, detail="User not found")

    new_access_token = create_access_token(user.email, user.id, timedelta(minutes=20))

    return {"access_token": new_access_token, "token_type": "bearer"}

@router.put("/users/reset-password/")
async def reset_password_for_user_request(
    request: PasswordResetRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(Users).filter_by(id=current_user.get("id")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User Not Found")

    if bcrypt_context.verify(request.new_password, user.password_hash):
        raise HTTPException(status_code=400, detail="New password must not equal old password!")

    if request.new_password != request.confirm_new_password:
        raise HTTPException(status_code=400, detail="New password must be equal confirm password!")

    user.password_hash = bcrypt_context.hash(request.new_password)
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"detail": "Password updated successfully"}

@router.patch("/users/update-user/")
async def update_user_for_profile_page(profile_request:UpdateUserRequest,dependency:user_dependency,db:Session=Depends(get_db)):
    user = db.query(Users).filter_by(id=dependency.get("id")).first()
    if not user:
        raise HTTPException(status_code=400,detail="User Not Found!")

    email_changed = user.email != profile_request.email

    user.name = profile_request.name
    user.surname = profile_request.surname
    user.username = profile_request.username
    if email_changed:
        user.email = profile_request.email
        active_refresh = db.query(Token).filter_by(user_id=user.id, token_type="refresh_token").first()
        if active_refresh:
            blacklisted_token = TokenBlacklist(
                jti=active_refresh.jti,
                token=active_refresh.token
            )
            db.add(blacklisted_token)
        new_access_token = create_access_token(user.email, user.id, timedelta(minutes=20))
        new_refresh_token = create_refresh_token(user.email, user.id)
        decoded_refresh = jwt.decode(new_refresh_token, ACCESS_TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
        expires_at = datetime.fromtimestamp(decoded_refresh["exp"], tz=timezone.utc)
        new_token_entry = Token(
            user_id=user.id,
            token=new_refresh_token,
            token_type="refresh_token",
            expires_at=expires_at,
            jti=decoded_refresh["jti"]
        )
        db.add(new_token_entry)
    user.phone_number = profile_request.phone_number


    db.add(user)
    db.commit()
    response = {
        "name":user.name,
        "surname":user.surname,
        "username":user.username,
        "email":user.email,
        "phone_number":user.phone_number
    }
    if email_changed:
        response.update({
            "access_token": new_access_token,
            "refresh_token": new_refresh_token
        })

    return response

@router.post("/users/request-password-reset/")
async def request_password_reset(payload: RequestPasswordResetSchema, db: Session = Depends(get_db)):
    user = db.query(Users).filter_by(email=payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    prt = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=expires_at
    )
    db.add(prt)
    db.commit()
    db.refresh(prt)

    if DEV_MODE:
        return {
            "detail": "Password reset token created (DEV MODE).",
            "reset_token": prt.token,
            "expires_at": prt.expires_at.isoformat()
        }

    return {"detail": "If this email exists, a reset link has been sent."}


@router.put("/users/reset-password-with-token/")
async def reset_password_with_token(body: ResetWithTokenSchema, db: Session = Depends(get_db)):
    # 1. token var mı
    prt = db.query(PasswordResetToken).filter_by(token=body.token).first()
    if not prt:
        raise HTTPException(status_code=400, detail="Invalid token")

    if prt.used:
        raise HTTPException(status_code=400, detail="Token already used")

    # 3. süresi geçmiş mi
    if prt.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Token expired")

    # 4. şifre eşleşmesi
    if body.new_password != body.confirm_new_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # 5. şifre politikası (tercihen): örn min length
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password too short (min 8 chars)")

    # 6. user'ı al, şifreyi güncelle
    user = db.query(Users).filter_by(id=prt.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # optional: eski ve yeni aynı mı kontrolü
    if bcrypt_context.verify(body.new_password, user.password_hash):
        raise HTTPException(status_code=400, detail="New password must not equal old password")

    user.password_hash = bcrypt_context.hash(body.new_password)
    db.add(user)

    # 7. token'ı işaretle (kullanıldı)
    prt.used = True
    db.add(prt)

    # 8. ekstra güvenlik: kullanıcının tüm refresh tokenlarını iptal et / blackliste ekle
    refresh_tokens = db.query(Token).filter_by(user_id=user.id, token_type="refresh_token").all()
    for rt in refresh_tokens:
        black = TokenBlacklist(jti=rt.jti, token=rt.token)
        db.add(black)
        db.delete(rt)  # veya rt.is_blacklisted = True

    db.commit()
    return {"detail": "Password reset successful"}

@router.post("/users/logout/")
async def user_logout_with_refresh_token(dependency:user_dependency,db:Session=Depends(get_db)):

    user_id = dependency.get("id")
    refresh_token_for_user = db.query(Token).filter_by(user_id=user_id,token_type="refresh_token").all()
    for rt in refresh_token_for_user:
        black = TokenBlacklist(jti=rt.jti, token=rt.token)
        db.add(black)
        db.delete(rt)
    db.commit()
    return {
        "detail": "Successfully logged out from devices",
        "email": dependency.get("email")
    }

@router.get("/users/me")
async def get_my_user_profile(dependency:user_dependency,db:Session=Depends(get_db)):
    user = db.query(Users).filter(Users.id.__eq__(dependency.get("id"))).first()
    if not user:
        raise HTTPException(status_code=400,detail="User can't get into database.")

    return {
        "name" : user.name,
        "surname" : user.surname,
        "username" :user.username,
        "email" : user.email,
        "phone_number" :user.phone_number
    }

