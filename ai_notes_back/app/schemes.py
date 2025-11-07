from datetime import datetime, timezone
from pydantic import BaseModel, Field, EmailStr
from typing import Optional,List
from enum import Enum


class Token(BaseModel):
    access_token : str
    refresh_token : str
    token_type : str

class UserRequest(BaseModel):
    name : str
    surname :str = Field(...,min_length=2,max_length=20)
    username :str = Field(...,min_length=5,max_length=15)
    email : EmailStr
    password_hash : str = Field(..., min_length=6)
    role : Optional[str] = "user"
    phone_number : Optional[str] = None


class LoginRequest(BaseModel):
    email : EmailStr
    password_hash : str = Field(..., min_length=6)


class PriorityEnum(Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class NoteRequest(BaseModel):
    title: str
    content: str
    priority: PriorityEnum = PriorityEnum.LOW
    is_feature_note: Optional[bool] = False
    feature_date: Optional[datetime] = None
    tags: Optional[List[str]] = []

class UpdateNotesRequest(BaseModel):
    title : str
    content :str
    priority : PriorityEnum
    tags: Optional[List[str]] = []

class TagCreateRequest(BaseModel):
    name: str

class PasswordResetRequest(BaseModel):
    new_password : str
    confirm_new_password : str

class UpdateUserRequest(BaseModel):
    name : str
    surname : str
    username : str
    phone_number : str
    email :str

class ResetPasswordRequestProfile(BaseModel):
    old_password : str
    new_password : str
    confirm_password : str

class IdsSchema(BaseModel):
    ids: List[int]

class UpdateTagRequest(BaseModel):
    name : str

class RequestPasswordResetSchema(BaseModel):
    email: str

class VerifyOTPSchema(BaseModel):
    otp: str

class ResetPasswordSchema(BaseModel):
    new_password: str
    confirm_new_password: str



