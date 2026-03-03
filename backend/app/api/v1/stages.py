from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...schemas.stage import StageOut, StageUpdate, StageGenerate
from ...services import stage_service, plan_service, analysis_service

router = APIRouter(prefix="/stages", tags=["stages"])

@router.post("/generate", response_model=list[StageOut])
async def generate(data: StageGenerate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, data.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404, "Plan not found")
    analysis = analysis_service.get_analysis_by_plan_id(db, plan.id)
    return await stage_service.generate_stages(db, plan, analysis)

@router.post("/regenerate", response_model=list[StageOut])
async def regenerate(data: StageGenerate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, data.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404, "Plan not found")
    analysis = analysis_service.get_analysis_by_plan_id(db, plan.id)
    return await stage_service.generate_stages(db, plan, analysis)

@router.patch("/{stage_id}", response_model=StageOut)
def update(stage_id: int, data: StageUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.stage import PlanStage
    stage = db.query(PlanStage).filter(PlanStage.id == stage_id).first()
    if not stage:
        raise HTTPException(404, "Stage not found")
    plan = plan_service.get_plan_by_id(db, stage.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(403, "Not authorized")
    return stage_service.update_stage(db, stage, data.model_dump(exclude_unset=True))

@router.post("/{stage_id}/confirm", response_model=StageOut)
def confirm(stage_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.stage import PlanStage
    stage = db.query(PlanStage).filter(PlanStage.id == stage_id).first()
    if not stage:
        raise HTTPException(404)
    return stage_service.confirm_stage(db, stage)

@router.post("/confirm-all")
def confirm_all(data: StageGenerate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, data.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    stage_service.confirm_all_stages(db, plan.id)
    return {"ok": True}

@router.get("/plan/{plan_id}", response_model=list[StageOut])
def get_by_plan(plan_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    return stage_service.get_stages_by_plan_id(db, plan_id)
