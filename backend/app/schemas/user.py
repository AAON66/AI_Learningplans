from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    username: Optional[str] = None
    is_admin: int = 0
    security_question: Optional[str] = None
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

class UserUpdate(BaseModel):
    username: Optional[str] = None
    security_question: Optional[str] = None
    security_answer: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str
