from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from ..models.user import User
from ..services import vip_service
from ..core.database import get_db
from ..core.security import get_current_user

def require_vip(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """VIP权限验证装饰器"""
    if not vip_service.check_vip_permission(db, user.id):
        raise HTTPException(403, "此功能需要VIP会员权限")
    return user
