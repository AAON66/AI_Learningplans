import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { planService } from '../services/planService'
import { validateContent } from '../utils/contentFilter'

export default function CreatePlan() {
  const nav = useNavigate()
  const [form, setForm] = useState({ title: '', goal: '', user_background: '', total_duration_days: 30, difficulty_level: 'beginner' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 验证标题
    const titleCheck = validateContent(form.title)
    if (!titleCheck.isValid) {
      setError(titleCheck.error || '标题验证失败')
      return
    }

    // 验证目标
    const goalCheck = validateContent(form.goal)
    if (!goalCheck.isValid) {
      setError(goalCheck.error || '目标验证失败')
      return
    }

    // 验证背景
    if (form.user_background) {
      const bgCheck = validateContent(form.user_background)
      if (!bgCheck.isValid) {
        setError(bgCheck.error || '背景验证失败')
        return
      }
    }

    setLoading(true)
    try {
      const res = await planService.create(form)
      nav(`/plans/${res.data.id}`)
    } catch {
      setError('创建失败，请重试')
    }
    setLoading(false)
  }

  const inputCls = "w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder:text-gray-400"
  const labelCls = "block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">创建学习计划</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800/50 p-5 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4 sm:space-y-5">
        <div>
          <label className={labelCls}>计划标题</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            className={inputCls} required placeholder="例如：学习 Python 编程" />
        </div>
        <div>
          <label className={labelCls}>学习目标</label>
          <textarea value={form.goal} onChange={e => setForm({...form, goal: e.target.value})}
            className={`${inputCls} h-24 resize-none`} required placeholder="描述你想要达成的学习目标" />
        </div>
        <div>
          <label className={labelCls}>个人背景</label>
          <textarea value={form.user_background} onChange={e => setForm({...form, user_background: e.target.value})}
            className={`${inputCls} h-20 resize-none`} placeholder="当前水平、可用时间等" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className={labelCls}>学习天数</label>
            <input type="number" value={form.total_duration_days}
              onChange={e => setForm({...form, total_duration_days: +e.target.value})}
              className={inputCls} min={1} />
          </div>
          <div>
            <label className={labelCls}>难度级别</label>
            <select value={form.difficulty_level} onChange={e => setForm({...form, difficulty_level: e.target.value})}
              className={inputCls}>
              <option value="beginner">初学者</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white py-2.5 rounded-lg hover:shadow-lg hover:shadow-brand-500/25 transition-all text-sm font-medium disabled:opacity-50">
          {loading ? '创建中...' : '创建计划'}
        </button>
      </form>
    </div>
  )
}
