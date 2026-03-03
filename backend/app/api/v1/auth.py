from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import hash_password, verify_password, create_access_token, create_refresh_token, get_current_user
from ...models.user import User
from ...schemas.user import UserCreate, UserLogin, UserOut, TokenResponse, RefreshRequest, UserUpdate
from jose import jwt, JWTError
from ...core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(email=data.email, hashed_password=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    return TokenResponse(access_token=create_access_token(user.id), refresh_token=create_refresh_token(user.id))

class ChangePassword(BaseModel):
    old_password: str
    new_password: str

class SetSecurityQA(BaseModel):
    question: str
    answer: str

class ForgotPassword(BaseModel):
    email: str
    security_answer: str
    new_password: str

@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user

@router.put("/me", response_model=UserOut)
def update_me(data: UserUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if data.username is not None:
        user.username = data.username
    if data.security_question is not None:
        user.security_question = data.security_question
    if data.security_answer is not None:
        user.security_answer = data.security_answer.lower().strip()
    db.commit()
    db.refresh(user)
    return user

@router.post("/change-password")
def change_password(data: ChangePassword, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not verify_password(data.old_password, user.hashed_password):
        raise HTTPException(400, "Old password is incorrect")
    user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"ok": True}

@router.post("/set-security-qa")
def set_security_qa(data: SetSecurityQA, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user.security_question = data.question
    user.security_answer = data.answer.lower().strip()
    db.commit()
    return {"ok": True}

@router.post("/forgot-password")
def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not user.security_question:
        raise HTTPException(400, "账号不存在或未设置安全问题")
    if data.security_answer.lower().strip() != user.security_answer:
        raise HTTPException(400, "安全问题回答错误")
    user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"ok": True}

@router.get("/security-question")
def get_security_question(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.security_question:
        raise HTTPException(400, "账号不存在或未设置安全问题")
    return {"question": user.security_question}

@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest):
    try:
        payload = jwt.decode(data.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(401, "Invalid refresh token")
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise HTTPException(401, "Invalid refresh token")
    return TokenResponse(access_token=create_access_token(user_id), refresh_token=create_refresh_token(user_id))
