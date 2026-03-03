from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.dashboard import DashboardStats, UserListItem
from ...services import dashboard_service
from ..v1.admin_auth import get_current_admin

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_stats(
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """获取看板统计数据（管理员）"""
    return dashboard_service.get_dashboard_stats(db)

@router.get("/users", response_model=list[UserListItem])
def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """获取用户列表（管理员）"""
    return dashboard_service.get_user_list(db, skip, limit)
