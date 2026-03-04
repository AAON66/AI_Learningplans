import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'

interface Task {
  id: number
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  stage_id: number
  created_at: string
}

interface Stage {
  id: number
  stage_name: string
  order_index: number
}

export default function KanbanBoard({ planId }: { planId: number }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskStage, setNewTaskStage] = useState<number | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)

  useEffect(() => {
    loadData()
  }, [planId])

  const loadData = async () => {
    try {
      const [stagesRes, tasksRes] = await Promise.all([
        api.get(`/plans/${planId}/stages`),
        api.get(`/plans/${planId}/kanban-tasks`)
      ])
      setStages(stagesRes.data)
      setTasks(tasksRes.data || [])
    } catch (error) {
      console.error('加载看板数据失败:', error)
    }
    setLoading(false)
  }

  const addTask = async () => {
    if (!newTaskTitle.trim() || !newTaskStage) return

    try {
      await api.post(`/plans/${planId}/kanban-tasks`, {
        title: newTaskTitle,
        stage_id: newTaskStage,
        status: 'todo'
      })
      setNewTaskTitle('')
      setShowAddTask(false)
      loadData()
    } catch (error) {
      console.error('添加任务失败:', error)
    }
  }

  const updateTaskStatus = async (taskId: number, newStatus: 'todo' | 'in_progress' | 'done') => {
    try {
      await api.put(`/plans/${planId}/kanban-tasks/${taskId}`, { status: newStatus })
      loadData()
    } catch (error) {
      console.error('更新任务状态失败:', error)
    }
  }

  const deleteTask = async (taskId: number) => {
    if (!confirm('确定删除此任务？')) return

    try {
      await api.delete(`/plans/${planId}/kanban-tasks/${taskId}`)
      loadData()
    } catch (error) {
      console.error('删除任务失败:', error)
    }
  }

  const columns = [
    { id: 'todo', title: '待办', color: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'in_progress', title: '进行中', color: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'done', title: '已完成', color: 'bg-green-50 dark:bg-green-900/20' }
  ]

  if (loading) return <div className="text-center py-8">加载中...</div>

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">学习看板</h2>
        <button
          onClick={() => setShowAddTask(true)}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm">
          + 添加任务
        </button>
      </div>

      {showAddTask && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <input
            type="text"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="任务标题"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 bg-white dark:bg-gray-800"
          />
          <select
            value={newTaskStage || ''}
            onChange={e => setNewTaskStage(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 bg-white dark:bg-gray-800">
            <option value="">选择学习阶段</option>
            {stages.map(s => (
              <option key={s.id} value={s.id}>{s.stage_name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={addTask}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm">
              添加
            </button>
            <button
              onClick={() => {
                setShowAddTask(false)
                setNewTaskTitle('')
                setNewTaskStage(null)
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
              取消
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(column => (
          <div key={column.id} className={`${column.color} rounded-lg p-4`}>
            <h3 className="font-medium mb-3 text-sm">{column.title}</h3>
            <div className="space-y-2">
              {tasks
                .filter(t => t.status === column.id)
                .map(task => {
                  const stage = stages.find(s => s.id === task.stage_id)
                  return (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium flex-1">{task.title}</p>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                      {stage && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {stage.stage_name}
                        </span>
                      )}
                      <div className="flex gap-1 mt-3">
                        {column.id !== 'todo' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, column.id === 'in_progress' ? 'todo' : 'in_progress')}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            ←
                          </button>
                        )}
                        {column.id !== 'done' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, column.id === 'todo' ? 'in_progress' : 'done')}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">总任务数</span>
          <span className="font-medium">{tasks.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-500 dark:text-gray-400">完成率</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  )
}
