from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...models.kanban_task import KanbanTask, TaskStatus
from ...models.plan import LearningPlan
from ...core.security import get_current_user
from pydantic import BaseModel

router = APIRouter()

class KanbanTaskCreate(BaseModel):
    title: str
    stage_id: int | None = None
    status: TaskStatus = TaskStatus.TODO
    description: str | None = None

class KanbanTaskUpdate(BaseModel):
    title: str | None = None
    status: TaskStatus | None = None
    description: str | None = None

class KanbanTaskResponse(BaseModel):
    id: int
    plan_id: int
    stage_id: int | None
    title: str
    description: str | None
    status: str
    created_at: str

    class Config:
        from_attributes = True

@router.get("/plans/{plan_id}/kanban-tasks", response_model=List[KanbanTaskResponse])
def get_kanban_tasks(plan_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    plan = db.query(LearningPlan).filter(LearningPlan.id == plan_id, LearningPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    tasks = db.query(KanbanTask).filter(KanbanTask.plan_id == plan_id).order_by(KanbanTask.created_at.desc()).all()
    return tasks

@router.post("/plans/{plan_id}/kanban-tasks", response_model=KanbanTaskResponse)
def create_kanban_task(plan_id: int, task: KanbanTaskCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    plan = db.query(LearningPlan).filter(LearningPlan.id == plan_id, LearningPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    new_task = KanbanTask(
        plan_id=plan_id,
        stage_id=task.stage_id,
        title=task.title,
        description=task.description,
        status=task.status
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.put("/plans/{plan_id}/kanban-tasks/{task_id}", response_model=KanbanTaskResponse)
def update_kanban_task(plan_id: int, task_id: int, task: KanbanTaskUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    plan = db.query(LearningPlan).filter(LearningPlan.id == plan_id, LearningPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    db_task = db.query(KanbanTask).filter(KanbanTask.id == task_id, KanbanTask.plan_id == plan_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.title is not None:
        db_task.title = task.title
    if task.status is not None:
        db_task.status = task.status
    if task.description is not None:
        db_task.description = task.description

    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/plans/{plan_id}/kanban-tasks/{task_id}")
def delete_kanban_task(plan_id: int, task_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    plan = db.query(LearningPlan).filter(LearningPlan.id == plan_id, LearningPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    db_task = db.query(KanbanTask).filter(KanbanTask.id == task_id, KanbanTask.plan_id == plan_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted"}
