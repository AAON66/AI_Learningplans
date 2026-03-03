import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { planService } from '../services/planService'

export default function Stats() {
  const { id } = useParams()
  const planId = Number(id)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    planService.getStats(planId).then(r => setStats(r.data))
  }, [planId])

  if (!stats) return <div className="text-center py-10 text-gray-400">加载中...</div>

  const cards = [
    { label: '总学习时长', value: `${Math.floor(stats.total_study_minutes / 60)}h ${stats.total_study_minutes % 60}m`, color: 'from-brand-500 to-brand-600', textColor: 'text-brand-600 dark:text-brand-400' },
    { label: '打卡天数', value: stats.total_check_ins, color: 'from-green-500 to-emerald-600', textColor: 'text-green-600 dark:text-green-400' },
    { label: '连续天数', value: stats.consecutive_days, color: 'from-amber-500 to-orange-600', textColor: 'text-amber-600 dark:text-amber-400' },
    { label: '完成度', value: `${stats.completion_percentage.toFixed(1)}%`, color: 'from-violet-500 to-purple-600', textColor: 'text-violet-600 dark:text-violet-400' },
  ]

  return (
    <div>
      <Link to={`/plans/${planId}`} className="text-sm text-gray-500 hover:text-brand-500 transition-colors mb-6 inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回详情
      </Link>
      <h1 className="text-2xl font-bold mb-8">学习统计</h1>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-2">{c.label}</p>
            <p className={`text-3xl font-bold ${c.textColor}`}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
