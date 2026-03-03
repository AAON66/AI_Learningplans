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

    # 获取最近30天的学习数据（用于图表）
    thirty_days_ago = today - timedelta(days=30)
    daily_data = db.query(
        CheckIn.check_in_date,
        func.sum(CheckIn.study_minutes).label('minutes')
    ).filter(
        CheckIn.plan_id == plan_id,
        CheckIn.check_in_date >= thirty_days_ago
    ).group_by(CheckIn.check_in_date).order_by(CheckIn.check_in_date).all()

    # 获取进度历史（用于趋势图）
    progress_history = db.query(
        ProgressRecord.record_date,
        ProgressRecord.completion_percentage
    ).filter(
        ProgressRecord.plan_id == plan_id
    ).order_by(ProgressRecord.record_date).all()

    # 获取每周统计
    weekly_stats = []
    for i in range(4):  # 最近4周
        week_start = today - timedelta(days=today.weekday() + 7 * i + 7)
        week_end = week_start + timedelta(days=6)
        week_minutes = db.query(func.coalesce(func.sum(CheckIn.study_minutes), 0)).filter(
            CheckIn.plan_id == plan_id,
            CheckIn.check_in_date >= week_start,
            CheckIn.check_in_date <= week_end
        ).scalar()
        week_checkins = db.query(func.count(CheckIn.id)).filter(
            CheckIn.plan_id == plan_id,
            CheckIn.check_in_date >= week_start,
            CheckIn.check_in_date <= week_end
        ).scalar()
        weekly_stats.append({
            'week': f'第{4-i}周',
            'minutes': int(week_minutes),
            'checkins': week_checkins
        })

    return {
        "total_study_minutes": total_minutes,
        "total_check_ins": total_checkins,
        "consecutive_days": consecutive,
        "completion_percentage": float(avg_completion),
        "daily_data": [{"date": str(d[0]), "minutes": int(d[1])} for d in daily_data],
        "progress_history": [{"date": str(p[0]), "percentage": float(p[1])} for p in progress_history],
        "weekly_stats": weekly_stats
    }
