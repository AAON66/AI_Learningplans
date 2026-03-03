from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...schemas.progress import ProgressCreate, ProgressOut, CheckInCreate, CheckInOut, StatsOut
from ...services import progress_service, plan_service

router = APIRouter(prefix="/progress", tags=["progress"])

@router.post("/record", response_model=ProgressOut)
def record(data: ProgressCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, data.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    return progress_service.create_progress_record(db, data.model_dump())

@router.get("/plan/{plan_id}", response_model=list[ProgressOut])
def get_progress(plan_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    return progress_service.get_progress_by_plan_id(db, plan_id)

@router.get("/plan/{plan_id}/stats", response_model=StatsOut)
def get_stats(plan_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    return progress_service.get_stats_by_plan_id(db, plan_id)

@router.post("/check-in", response_model=CheckInOut)
def check_in(data: CheckInCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, data.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    return progress_service.create_check_in(db, data.model_dump())

@router.get("/plan/{plan_id}/check-ins", response_model=list[CheckInOut])
def get_checkins(plan_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    return progress_service.get_check_ins_by_plan_id(db, plan_id)
