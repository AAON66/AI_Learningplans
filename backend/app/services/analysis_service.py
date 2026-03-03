from sqlalchemy.orm import Session
from ..models.analysis import NeedAnalysis
from .llm_service import call_deepseek, parse_json_response, PROMPTS

def get_analysis_by_plan_id(db: Session, plan_id: int):
    return db.query(NeedAnalysis).filter(NeedAnalysis.plan_id == plan_id).first()

def delete_analysis_by_plan_id(db: Session, plan_id: int):
    db.query(NeedAnalysis).filter(NeedAnalysis.plan_id == plan_id).delete()
    db.commit()

def confirm_analysis(db: Session, analysis: NeedAnalysis):
    analysis.confirmed = True
    analysis.plan.status = "planning"
    db.commit()
    db.refresh(analysis)
    return analysis

async def generate_analysis(db: Session, plan) -> NeedAnalysis:
    delete_analysis_by_plan_id(db, plan.id)
    prompt = PROMPTS["analysis"].format(goal=plan.goal, background=plan.user_background or "无")
    result = await call_deepseek(prompt)
    try:
        data = parse_json_response(result)
    except Exception:
        data = {"analysis_result": result, "key_points": "", "recommended_path": ""}
    analysis = NeedAnalysis(
        plan_id=plan.id,
        analysis_result=data.get("analysis_result", result),
        key_points=data.get("key_points", ""),
        recommended_path=data.get("recommended_path", ""),
    )
    db.add(analysis)
    plan.status = "analysis"
    db.commit()
    db.refresh(analysis)
    return analysis
