from sqlalchemy.orm import Session
from ..models.resource import LearningResource
from .llm_service import call_deepseek, parse_json_response, PROMPTS

def get_resources_by_stage_id(db: Session, stage_id: int):
    return db.query(LearningResource).filter(LearningResource.stage_id == stage_id).order_by(LearningResource.order_index).all()

def select_resource(db: Session, resource: LearningResource, selected: bool = True):
    resource.user_selected = selected
    db.commit()
    return resource

def delete_resource(db: Session, resource: LearningResource):
    db.delete(resource)
    db.commit()

def confirm_all_resources(db: Session, stage_id: int):
    db.query(LearningResource).filter(LearningResource.stage_id == stage_id).update({"user_selected": True})
    db.commit()

def confirm_all_resources_for_plan(db: Session, plan):
    from ..models.stage import PlanStage
    stage_ids = [s.id for s in db.query(PlanStage).filter(PlanStage.plan_id == plan.id).all()]
    if stage_ids:
        db.query(LearningResource).filter(LearningResource.stage_id.in_(stage_ids)).update({"user_selected": True}, synchronize_session=False)
    plan.status = "method"
    db.commit()

async def recommend_resources(db: Session, stage, plan) -> list:
    db.query(LearningResource).filter(LearningResource.stage_id == stage.id).delete()
    db.commit()
    prompt = PROMPTS["resources"].format(stage_name=stage.stage_name, description=stage.description or "")
    result = await call_deepseek(prompt)
    try:
        items = parse_json_response(result)
    except Exception:
        items = [{"resource_type": "article", "title": "推荐资源", "description": result}]
    resources = []
    for i, item in enumerate(items):
        r = LearningResource(stage_id=stage.id, order_index=i, resource_type=item.get("resource_type", ""),
                             title=item.get("title", ""), description=item.get("description", ""),
                             url=item.get("url", ""), provider=item.get("provider", ""),
                             estimated_hours=item.get("estimated_hours"), difficulty=item.get("difficulty", ""),
                             is_free=item.get("is_free", True))
        db.add(r)
        resources.append(r)
    plan.status = "content"
    db.commit()
    for r in resources:
        db.refresh(r)
    return resources
