from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...schemas.plan import PlanCreate, PlanUpdate, PlanOut
from ...services import plan_service

router = APIRouter(prefix="/plans", tags=["plans"])

def _check_owner(plan, user: User):
    if not plan:
        raise HTTPException(404, "Plan not found")
    if plan.user_id != user.id:
        raise HTTPException(403, "Not authorized")
    return plan

@router.post("", response_model=PlanOut)
def create(data: PlanCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return plan_service.create_plan(db, user.id, data)

@router.get("", response_model=list[PlanOut])
def list_plans(status: str = None, page: int = Query(1, ge=1), per_page: int = Query(20, ge=1, le=100),
               db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return plan_service.get_plans(db, user.id, status, page, per_page)

@router.get("/{plan_id}", response_model=PlanOut)
def get(plan_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _check_owner(plan_service.get_plan_by_id(db, plan_id), user)

@router.patch("/{plan_id}", response_model=PlanOut)
def update(plan_id: int, data: PlanUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = _check_owner(plan_service.get_plan_by_id(db, plan_id), user)
    return plan_service.update_plan(db, plan, data)

@router.delete("/{plan_id}")
def delete(plan_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = _check_owner(plan_service.get_plan_by_id(db, plan_id), user)
    plan_service.delete_plan(db, plan)
    return {"ok": True}

@router.post("/{plan_id}/start", response_model=PlanOut)
def start(plan_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = _check_owner(plan_service.get_plan_by_id(db, plan_id), user)
    return plan_service.update_plan_status(db, plan, "active")

@router.post("/{plan_id}/pause", response_model=PlanOut)
def pause(plan_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = _check_owner(plan_service.get_plan_by_id(db, plan_id), user)
    return plan_service.update_plan_status(db, plan, "paused")

@router.post("/{plan_id}/complete", response_model=PlanOut)
def complete(plan_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = _check_owner(plan_service.get_plan_by_id(db, plan_id), user)
    return plan_service.update_plan_status(db, plan, "completed")
