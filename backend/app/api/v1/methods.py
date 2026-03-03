from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...models.method import LearningMethod
from ...schemas.method import MethodOut, MethodUpdate, MethodGenerate
from ...services import method_service, plan_service, stage_service

router = APIRouter(prefix="/methods", tags=["methods"])

@router.post("/confirm-all")
def confirm_all(data: MethodGenerate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, data.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    method_service.confirm_all_methods(db, plan)
    return {"ok": True}

@router.get("/plan/{plan_id}", response_model=list[MethodOut])
def get_by_plan(plan_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    stages = stage_service.get_stages_by_plan_id(db, plan_id)
    methods = []
    for s in stages:
        methods.extend(method_service.get_methods_by_stage_id(db, s.id))
    return methods

@router.post("/generate", response_model=list[MethodOut])
async def generate(data: MethodGenerate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, data.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    stages = stage_service.get_stages_by_plan_id(db, plan.id)
    return await method_service.generate_methods(db, plan, stages)

@router.post("/regenerate", response_model=list[MethodOut])
async def regenerate(data: MethodGenerate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, data.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    stages = stage_service.get_stages_by_plan_id(db, plan.id)
    return await method_service.generate_methods(db, plan, stages)

@router.patch("/{method_id}", response_model=MethodOut)
def update(method_id: int, data: MethodUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    m = db.query(LearningMethod).filter(LearningMethod.id == method_id).first()
    if not m:
        raise HTTPException(404)
    return method_service.update_method(db, m, data.model_dump(exclude_unset=True))

@router.post("/{method_id}/confirm", response_model=MethodOut)
def confirm(method_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    m = db.query(LearningMethod).filter(LearningMethod.id == method_id).first()
    if not m:
        raise HTTPException(404)
    return method_service.confirm_method(db, m)
