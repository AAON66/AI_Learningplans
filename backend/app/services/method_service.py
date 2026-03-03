from sqlalchemy.orm import Session
from ..models.method import LearningMethod
from .llm_service import call_deepseek, parse_json_response, PROMPTS

def get_methods_by_stage_id(db: Session, stage_id: int):
    return db.query(LearningMethod).filter(LearningMethod.stage_id == stage_id).order_by(LearningMethod.order_index).all()

def update_method(db: Session, method: LearningMethod, data: dict):
    for k, v in data.items():
        if v is not None:
            setattr(method, k, v)
    db.commit()
    db.refresh(method)
    return method

def confirm_method(db: Session, method: LearningMethod):
    method.confirmed = True
    db.commit()
    return method

def confirm_all_methods(db: Session, plan):
    from ..models.stage import PlanStage
    stage_ids = [s.id for s in db.query(PlanStage).filter(PlanStage.plan_id == plan.id).all()]
    if stage_ids:
        db.query(LearningMethod).filter(LearningMethod.stage_id.in_(stage_ids)).update({"confirmed": True}, synchronize_session=False)
    plan.status = "active"
    from datetime import date, timedelta
    if not plan.start_date:
        plan.start_date = date.today()
        if plan.total_duration_days:
            plan.target_end_date = date.today() + timedelta(days=plan.total_duration_days)
    db.commit()

def delete_methods_by_plan_id(db: Session, plan_id: int):
    from ..models.stage import PlanStage
    stage_ids = [s.id for s in db.query(PlanStage).filter(PlanStage.plan_id == plan_id).all()]
    if stage_ids:
        db.query(LearningMethod).filter(LearningMethod.stage_id.in_(stage_ids)).delete(synchronize_session=False)
        db.commit()

async def generate_methods(db: Session, plan, stages) -> list:
    delete_methods_by_plan_id(db, plan.id)
    all_methods = []
    for stage in stages:
        prompt = PROMPTS["methods"].format(
            stage_name=stage.stage_name, description=stage.description or "",
            resources=str([r.title for r in stage.resources]) if stage.resources else "无"
        )
        result = await call_deepseek(prompt)
        try:
            items = parse_json_response(result)
        except Exception:
            items = [{"method_type": "practice", "title": "学习方法", "content": result, "schedule": ""}]
        for i, item in enumerate(items):
            m = LearningMethod(stage_id=stage.id, order_index=i, method_type=item.get("method_type", ""),
                               title=item.get("title", ""), content=item.get("content", ""),
                               schedule=item.get("schedule", ""))
            db.add(m)
            all_methods.append(m)
    plan.status = "method"
    db.commit()
    for m in all_methods:
        db.refresh(m)
    return all_methods
