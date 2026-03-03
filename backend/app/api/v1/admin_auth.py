from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import hash_password, verify_password, create_access_token
from ...models.admin import AdminUser
from ...schemas.admin import AdminLogin, AdminOut, AdminTokenResponse
from jose import jwt, JWTError
from ...core.config import settings
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBearer()

def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> AdminUser:
    """获取当前管理员"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "admin":
            raise HTTPException(401, "Invalid admin token")
        admin_id = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise HTTPException(401, "Invalid admin token")

    admin = db.query(AdminUser).filter(AdminUser.id == admin_id).first()
    if not admin:
        raise HTTPException(401, "Admin not found")
    return admin

@router.post("/login", response_model=AdminTokenResponse)
def admin_login(data: AdminLogin, db: Session = Depends(get_db)):
    """管理员登录"""
    admin = db.query(AdminUser).filter(AdminUser.username == data.username).first()
    if not admin or not verify_password(data.password, admin.hashed_password):
        raise HTTPException(401, "用户名或密码错误")

    # 创建管理员token
    token = create_access_token(admin.id, token_type="admin")
    return AdminTokenResponse(access_token=token)

@router.get("/me", response_model=AdminOut)
def get_admin_info(admin: AdminUser = Depends(get_current_admin)):
    """获取当前管理员信息"""
    return admin
