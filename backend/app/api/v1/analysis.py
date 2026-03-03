from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...schemas.analysis import AnalysisOut, AnalysisGenerate
from ...services import analysis_service, plan_service

router = APIRouter(prefix="/analysis", tags=["analysis"])

@router.get("/plan/{plan_id}", response_model=AnalysisOut)
def get_by_plan(plan_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404)
    a = analysis_service.get_analysis_by_plan_id(db, plan_id)
    if not a:
        raise HTTPException(404)
    return a

@router.post("/generate", response_model=AnalysisOut)
async def generate(data: AnalysisGenerate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, data.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404, "Plan not found")
    return await analysis_service.generate_analysis(db, plan)

@router.post("/regenerate", response_model=AnalysisOut)
async def regenerate(data: AnalysisGenerate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plan = plan_service.get_plan_by_id(db, data.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(404, "Plan not found")
    return await analysis_service.generate_analysis(db, plan)

@router.post("/{analysis_id}/confirm", response_model=AnalysisOut)
def confirm(analysis_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from ...models.analysis import NeedAnalysis
    a = db.query(NeedAnalysis).filter(NeedAnalysis.id == analysis_id).first()
    if not a:
        raise HTTPException(404, "Analysis not found")
    plan = plan_service.get_plan_by_id(db, a.plan_id)
    if not plan or plan.user_id != user.id:
        raise HTTPException(403, "Not authorized")
    return analysis_service.confirm_analysis(db, a)
