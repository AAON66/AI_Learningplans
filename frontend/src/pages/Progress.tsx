import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { planService } from '../services/planService'

export default function Progress() {
  const { id } = useParams()
  const planId = Number(id)
  const [form, setForm] = useState({
    check_in_date: new Date().toISOString().split('T')[0],
    study_minutes: 0, reflection: '', mood_score: 5
  })
  const [success, setSuccess] = useState(false)

  const getMoodEmoji = (score: number) => {
    if (score <= 2) return { emoji: '😢', label: '很糟糕', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' }
    if (score <= 4) return { emoji: '😟', label: '不太好', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' }
    if (score <= 6) return { emoji: '😐', label: '一般般', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' }
    if (score <= 8) return { emoji: '😊', label: '不错', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' }
    return { emoji: '😄', label: '非常好', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' }
  }

  const currentMood = getMoodEmoji(form.mood_score)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await planService.checkIn({ plan_id: planId, ...form })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch { alert('打卡失败') }
  }

  const inputCls = "w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
  const labelCls = "block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"

  return (
    <div className="max-w-2xl mx-auto">
      <Link to={`/plans/${planId}`} className="text-xs sm:text-sm text-gray-500 hover:text-brand-500 transition-colors mb-4 sm:mb-6 inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回详情
      </Link>
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">记录学习进度</h1>
      {success && <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg mb-4 text-xs sm:text-sm">打卡成功！</div>}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800/50 p-5 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4 sm:space-y-5">
        <div>
          <label className={labelCls}>日期</label>
          <input type="date" value={form.check_in_date}
            onChange={e => setForm({...form, check_in_date: e.target.value})}
            className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>学习时长（分钟）</label>
          <input type="number" value={form.study_minutes}
            onChange={e => setForm({...form, study_minutes: +e.target.value})}
            className={inputCls} min={0} required />
        </div>
        <div>
          <label className={labelCls}>学习反思</label>
          <textarea value={form.reflection}
            onChange={e => setForm({...form, reflection: e.target.value})}
            className={`${inputCls} h-24 resize-none`} placeholder="今天学到了什么？有什么收获？" />
        </div>
        <div>
          <label className={labelCls}>心情评分</label>
          <div className={`${currentMood.bg} rounded-xl p-6 mb-3 transition-all`}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-6xl animate-bounce">{currentMood.emoji}</span>
              <div className="text-center">
                <div className={`text-3xl font-bold ${currentMood.color}`}>{form.mood_score}</div>
                <div className={`text-sm font-medium ${currentMood.color} mt-1`}>{currentMood.label}</div>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={form.mood_score}
              onChange={e => setForm({...form, mood_score: +e.target.value})}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right,
                  #ef4444 0%, #ef4444 20%,
                  #f97316 20%, #f97316 40%,
                  #eab308 40%, #eab308 60%,
                  #22c55e 60%, #22c55e 80%,
                  #10b981 80%, #10b981 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
              <span>😢 1</span>
              <span>😟 3</span>
              <span>😐 5</span>
              <span>😊 7</span>
              <span>😄 10</span>
            </div>
          </div>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white py-2.5 rounded-lg hover:shadow-lg hover:shadow-brand-500/25 transition-all text-sm font-medium">
          提交打卡
        </button>
      </form>
    </div>
  )
}
