from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from ..models.progress import ProgressRecord
from ..models.checkin import CheckIn

def create_progress_record(db: Session, data: dict) -> ProgressRecord:
    record = ProgressRecord(**data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_progress_by_plan_id(db: Session, plan_id: int):
    return db.query(ProgressRecord).filter(ProgressRecord.plan_id == plan_id).order_by(ProgressRecord.record_date.desc()).all()

def create_check_in(db: Session, data: dict) -> CheckIn:
    checkin = CheckIn(**data)
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    return checkin

def get_check_ins_by_plan_id(db: Session, plan_id: int):
    return db.query(CheckIn).filter(CheckIn.plan_id == plan_id).order_by(CheckIn.check_in_date.desc()).all()

def get_stats_by_plan_id(db: Session, plan_id: int) -> dict:
    total_minutes = db.query(func.coalesce(func.sum(CheckIn.study_minutes), 0)).filter(CheckIn.plan_id == plan_id).scalar()
    total_checkins = db.query(func.count(CheckIn.id)).filter(CheckIn.plan_id == plan_id).scalar()
    # consecutive days
    checkins = db.query(CheckIn.check_in_date).filter(CheckIn.plan_id == plan_id).order_by(CheckIn.check_in_date.desc()).all()
    consecutive = 0
    today = date.today()
    for c in checkins:
        if c[0] == today - timedelta(days=consecutive):
            consecutive += 1
        else:
            break
    avg_completion = db.query(func.coalesce(func.avg(ProgressRecord.completion_percentage), 0)).filter(ProgressRecord.plan_id == plan_id).scalar()
    return {"total_study_minutes": total_minutes, "total_check_ins": total_checkins,
            "consecutive_days": consecutive, "completion_percentage": float(avg_completion)}
