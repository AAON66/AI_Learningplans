import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { planService } from '../services/planService'
import UserLimitsBar from '../components/vip/UserLimitsBar'

const STATUS_MAP: Record<string, string> = {
  draft: '草稿', analysis: '分析中', planning: '规划中', content: '内容推荐',
  method: '方式制定', active: '进行中', completed: '已完成', paused: '已暂停'
}
const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  active: 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400',
  completed: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  paused: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
}
const DIFFICULTY_MAP: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
  expert: '专家'
}

interface Plan {
  id: number; title: string; goal: string; difficulty_level: string;
  status: string; created_at: string;
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [filter, setFilter] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; title: string } | null>(null)

  const loadPlans = () => {
    planService.list(filter ? { status: filter } : {}).then(r => setPlans(r.data))
  }

  useEffect(() => {
    loadPlans()
  }, [filter])

  const handleDelete = async (id: number) => {
    try {
      await planService.delete(id)
      setDeleteConfirm(null)
      loadPlans()
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">我的学习计划</h1>
        <Link to="/plans/create" className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-brand-500/25 transition-all text-sm font-medium">
          创建新计划
        </Link>
      </div>

      <UserLimitsBar />

      <div className="flex gap-2 mb-6">
        {['', 'active', 'completed', 'paused'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-sm transition-all ${filter === s
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-300 dark:hover:border-brand-700'}`}>
            {s ? STATUS_MAP[s] : '全部'}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-none transition-all group relative">
            <Link to={`/plans/${p.id}`} className="block">
              <h3 className="font-semibold mb-1.5 group-hover:text-brand-500 transition-colors pr-8">{p.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{p.goal}</p>
              <div className="flex justify-between items-center text-xs">
                <span className={`px-2.5 py-1 rounded-md ${STATUS_COLOR[p.status] || STATUS_COLOR.draft}`}>
                  {STATUS_MAP[p.status] || p.status}
                </span>
                <span className="text-gray-400 dark:text-gray-500">{DIFFICULTY_MAP[p.difficulty_level] || p.difficulty_level}</span>
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setDeleteConfirm({ id: p.id, title: p.title })
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
              title="删除计划">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
      {plans.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 dark:text-gray-500 mb-4">暂无学习计划</p>
          <Link to="/plans/create" className="text-brand-500 hover:text-brand-600 text-sm transition-colors">创建第一个计划 &rarr;</Link>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">确认删除</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              确定要删除学习计划「{deleteConfirm.title}」吗？此操作无法撤销，所有相关数据都将被永久删除。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition-all">
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
