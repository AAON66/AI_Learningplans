"""add kanban tasks

Revision ID: add_kanban_tasks
Revises: 4184d3a6b6d4
Create Date: 2024-03-04

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_kanban_tasks'
down_revision = '4184d3a6b6d4'

def upgrade():
    op.create_table(
        'kanban_tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('plan_id', sa.Integer(), nullable=False),
        sa.Column('stage_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='todo'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.current_timestamp(), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['plan_id'], ['learning_plans.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['stage_id'], ['plan_stages.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_kanban_tasks_id'), 'kanban_tasks', ['id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_kanban_tasks_id'), table_name='kanban_tasks')
    op.drop_table('kanban_tasks')
