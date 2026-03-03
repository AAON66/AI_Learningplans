from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...models.resource import LearningResource
from ...schemas.resource import ResourceOut, ResourceRecommend
from ...services import resource_service, plan_service

router = APIRouter(prefix="/resources", tags=["resources"])

@router.post("/confirm-all")
def confirm_all(data: ResourceRecommend, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.stage import PlanStage
    stage = db.query(PlanStage).filter(PlanStage.id == data.stage_id).first()
    if not stage:
        raise HTTPException(404)
    plan = plan_service.get_plan_by_id(db, stage.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(403)
    resource_service.confirm_all_resources(db, stage.id)
    return {"ok": True}

@router.post("/confirm-all-plan")
def confirm_all_plan(data: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, data.get("plan_id"))
    if not plan or plan.user_id != user.id:
        raise HTTPException(403)
    resource_service.confirm_all_resources_for_plan(db, plan)
    return {"ok": True}

@router.post("/recommend", response_model=list[ResourceOut])
async def recommend(data: ResourceRecommend, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.stage import PlanStage
    stage = db.query(PlanStage).filter(PlanStage.id == data.stage_id).first()
    if not stage:
        raise HTTPException(404, "Stage not found")
    plan = plan_service.get_plan_by_id(db, stage.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(403)
    return await resource_service.recommend_resources(db, stage, plan)

@router.get("/stage/{stage_id}", response_model=list[ResourceOut])
def get_by_stage(stage_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return resource_service.get_resources_by_stage_id(db, stage_id)

@router.post("/{resource_id}/select", response_model=ResourceOut)
def select(resource_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    r = db.query(LearningResource).filter(LearningResource.id == resource_id).first()
    if not r:
        raise HTTPException(404)
    return resource_service.select_resource(db, r, True)

@router.delete("/{resource_id}")
def delete(resource_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    r = db.query(LearningResource).filter(LearningResource.id == resource_id).first()
    if not r:
        raise HTTPException(404)
    resource_service.delete_resource(db, r)
    return {"ok": True}
