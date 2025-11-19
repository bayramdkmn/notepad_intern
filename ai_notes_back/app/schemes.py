from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from typing import Optional,List
from enum import Enum


class Token(BaseModel):
    access_token : str
    refresh_token : str
    token_type : str

class SummaryRequest(BaseModel):
    title: str
    content : str
    tags : list[str] = []

class SummaryResponse(BaseModel):
    summary :str

class UserRequest(BaseModel):
    name : str
    surname :str = Field(...,min_length=2,max_length=20)
    username :str = Field(...,min_length=5,max_length=15)
    email : EmailStr
    password_hash : str = Field(..., min_length=6)
    role : Optional[str] = "user"
    phone_number : Optional[str] = None

class PriorityEnum(str,Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class UpdateNotesRequest(BaseModel):
    title : str
    content :str
    priority : PriorityEnum
    tags: Optional[List[str]] = []

class LoginRequest(BaseModel):
    email : EmailStr
    password_hash : str = Field(..., min_length=6)

class NoteRequest(BaseModel):
    title: str
    content: str
    priority: PriorityEnum = PriorityEnum.LOW.value
    is_feature_note: Optional[bool] = False
    feature_date: Optional[datetime] = None
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
    otp : str
    new_password: str
    confirm_new_password: str



