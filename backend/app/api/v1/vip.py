from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...schemas.vip import VIPCardCreate, VIPCardOut, VIPCardActivate, VIPStatusOut
from ...services import vip_service
from .admin_auth import get_current_admin

router = APIRouter(prefix="/vip", tags=["vip"])

@router.post("/cards", response_model=list[VIPCardOut])
def create_cards(
    data: VIPCardCreate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """生成VIP卡密（管理员）"""
    return vip_service.create_vip_cards(db, data.duration_days, data.count)

@router.get("/cards", response_model=list[VIPCardOut])
def list_cards(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    is_used: bool = None,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """获取卡密列表（管理员）"""
    return vip_service.get_vip_cards(db, skip, limit, is_used)

@router.delete("/cards/{card_id}")
def delete_card(
    card_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """删除卡密（管理员）"""
    vip_service.delete_vip_card(db, card_id)
    return {"ok": True}

@router.post("/activate", response_model=VIPStatusOut)
def activate(
    data: VIPCardActivate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """激活VIP"""
    vip_service.activate_vip(db, user.id, data.card_code)
    status = vip_service.get_vip_status(db, user.id)
    return status

@router.get("/status", response_model=VIPStatusOut)
def get_status(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """获取VIP状态"""
    return vip_service.get_vip_status(db, user.id)

@router.get("/limits")
def get_limits(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """获取用户限制信息"""
    from ...services.vip_limits import get_user_limits
    return get_user_limits(db, user.id)
