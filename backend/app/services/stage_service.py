from sqlalchemy.orm import Session
from ..models.stage import PlanStage
from .llm_service import call_deepseek, parse_json_response, PROMPTS

def get_stages_by_plan_id(db: Session, plan_id: int):
    return db.query(PlanStage).filter(PlanStage.plan_id == plan_id).order_by(PlanStage.order_index).all()

def delete_stages_by_plan_id(db: Session, plan_id: int):
    db.query(PlanStage).filter(PlanStage.plan_id == plan_id).delete()
    db.commit()

def update_stage(db: Session, stage: PlanStage, data: dict):
    for k, v in data.items():
        if v is not None:
            setattr(stage, k, v)
    db.commit()
    db.refresh(stage)
    return stage

def confirm_stage(db: Session, stage: PlanStage):
    stage.confirmed = True
    db.commit()
    return stage

def confirm_all_stages(db: Session, plan_id: int):
    from ..models.plan import LearningPlan
    db.query(PlanStage).filter(PlanStage.plan_id == plan_id).update({"confirmed": True})
    plan = db.query(LearningPlan).filter(LearningPlan.id == plan_id).first()
    if plan:
        plan.status = "content"
    db.commit()

async def generate_stages(db: Session, plan, analysis) -> list:
    delete_stages_by_plan_id(db, plan.id)
    prompt = PROMPTS["stages"].format(
        goal=plan.goal, background=plan.user_background or "无",
        days=plan.total_duration_days or 30, difficulty=plan.difficulty_level,
        analysis=analysis.analysis_result if analysis else "无"
    )
    result = await call_deepseek(prompt)
    try:
        items = parse_json_response(result)
    except Exception:
        items = [{"stage_name": "阶段1", "description": result, "duration_days": 7, "milestones": ""}]
    stages = []
    for i, item in enumerate(items):
        s = PlanStage(plan_id=plan.id, order_index=i, stage_name=item.get("stage_name", f"阶段{i+1}"),
                      description=item.get("description", ""), duration_days=item.get("duration_days", 7),
                      milestones=item.get("milestones", ""))
        db.add(s)
        stages.append(s)
    plan.status = "planning"
    db.commit()
    for s in stages:
        db.refresh(s)
    return stages
