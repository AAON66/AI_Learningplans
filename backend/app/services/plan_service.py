from sqlalchemy.orm import Session
from ..models.plan import LearningPlan
from ..schemas.plan import PlanCreate, PlanUpdate
from datetime import date, timedelta

def create_plan(db: Session, user_id: int, data: PlanCreate) -> LearningPlan:
    plan = LearningPlan(user_id=user_id, **data.model_dump())
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan

def get_plans(db: Session, user_id: int, status: str = None, page: int = 1, per_page: int = 20):
    q = db.query(LearningPlan).filter(LearningPlan.user_id == user_id)
    if status:
        q = q.filter(LearningPlan.status == status)
    return q.order_by(LearningPlan.created_at.desc()).offset((page-1)*per_page).limit(per_page).all()

def get_plan_by_id(db: Session, plan_id: int) -> LearningPlan:
    return db.query(LearningPlan).filter(LearningPlan.id == plan_id).first()

def update_plan(db: Session, plan: LearningPlan, data: PlanUpdate) -> LearningPlan:
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(plan, k, v)
    db.commit()
    db.refresh(plan)
    return plan

def update_plan_status(db: Session, plan: LearningPlan, status: str) -> LearningPlan:
    plan.status = status
    if status == "active" and not plan.start_date:
        plan.start_date = date.today()
        if plan.total_duration_days:
            plan.target_end_date = date.today() + timedelta(days=plan.total_duration_days)
    db.commit()
    db.refresh(plan)
    return plan

def delete_plan(db: Session, plan: LearningPlan):
    db.delete(plan)
    db.commit()
