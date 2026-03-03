import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { planService } from '../services/planService'
import api from '../services/api'

export default function Stats() {
  const { id } = useParams()
  const planId = Number(id)
  const [stats, setStats] = useState<any>(null)
  const [isVip, setIsVip] = useState(false)

  useEffect(() => {
    planService.getStats(planId).then(r => setStats(r.data))
    api.get('/api/v1/vip/status').then(r => setIsVip(r.data.is_vip)).catch(() => {})
  }, [planId])

  if (!stats) return <div className="text-center py-10 text-gray-400">加载中...</div>

  const cards = [
    { label: '总学习时长', value: `${Math.floor(stats.total_study_minutes / 60)}h ${stats.total_study_minutes % 60}m`, color: 'from-brand-500 to-brand-600', textColor: 'text-brand-600 dark:text-brand-400' },
    { label: '打卡天数', value: stats.total_check_ins, color: 'from-green-500 to-emerald-600', textColor: 'text-green-600 dark:text-green-400' },
    { label: '连续天数', value: stats.consecutive_days, color: 'from-amber-500 to-orange-600', textColor: 'text-amber-600 dark:text-amber-400' },
    { label: '完成度', value: `${stats.completion_percentage.toFixed(1)}%`, color: 'from-violet-500 to-purple-600', textColor: 'text-violet-600 dark:text-violet-400' },
  ]

  // VIP 专属高级指标
  const avgDailyMinutes = stats.total_check_ins > 0 ? Math.round(stats.total_study_minutes / stats.total_check_ins) : 0
  const efficiency = stats.completion_percentage > 0 ? Math.min(100, Math.round((stats.completion_percentage / (stats.total_check_ins || 1)) * 10)) : 0

  return (
    <div>
      <Link to={`/plans/${planId}`} className="text-sm text-gray-500 hover:text-brand-500 transition-colors mb-6 inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回详情
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">学习统计</h1>
        {isVip && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            VIP高级统计
          </span>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {cards.map(c => (
          <div key={c.label} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-2">{c.label}</p>
            <p className={`text-3xl font-bold ${c.textColor}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {isVip ? (
        <>
          {/* VIP 专属高级分析 */}
          <div className="grid gap-5 md:grid-cols-2 mb-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-900/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-amber-900 dark:text-amber-100">学习效率分析</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-amber-700 dark:text-amber-300">日均学习时长</span>
                    <span className="font-semibold text-amber-900 dark:text-amber-100">{avgDailyMinutes} 分钟</span>
                  </div>
                  <div className="h-2 bg-amber-200 dark:bg-amber-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: `${Math.min(100, (avgDailyMinutes / 120) * 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-amber-700 dark:text-amber-300">学习效率指数</span>
                    <span className="font-semibold text-amber-900 dark:text-amber-100">{efficiency}%</span>
                  </div>
                  <div className="h-2 bg-amber-200 dark:bg-amber-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: `${efficiency}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-violet-200 dark:border-violet-900/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-violet-900 dark:text-violet-100">学习趋势</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-600">
                  <path d="M3 3v18h18"/><path d="M18 17l-5-5-3 3-5-5"/>
                </svg>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-violet-700 dark:text-violet-300">坚持度</span>
                  <span className="font-semibold text-violet-900 dark:text-violet-100">
                    {stats.consecutive_days >= 7 ? '优秀' : stats.consecutive_days >= 3 ? '良好' : '需加油'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700 dark:text-violet-300">进度评估</span>
                  <span className="font-semibold text-violet-900 dark:text-violet-100">
                    {stats.completion_percentage >= 80 ? '超前' : stats.completion_percentage >= 50 ? '正常' : '偏慢'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700 dark:text-violet-300">预计完成</span>
                  <span className="font-semibold text-violet-900 dark:text-violet-100">
                    {stats.completion_percentage > 0 ? `${Math.ceil((100 - stats.completion_percentage) / (stats.completion_percentage / stats.total_check_ins))} 天` : '未知'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 学习建议 */}
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              AI 学习建议
            </h3>
            <div className="space-y-3 text-sm">
              {avgDailyMinutes < 60 && (
                <div className="flex gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-900/30">
                  <span className="text-amber-600">💡</span>
                  <p className="text-amber-800 dark:text-amber-200">建议增加每日学习时长至60分钟以上，以提高学习效率</p>
                </div>
              )}
              {stats.consecutive_days < 3 && (
                <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30">
                  <span className="text-blue-600">📅</span>
                  <p className="text-blue-800 dark:text-blue-200">保持连续学习可以提高知识留存率，建议每天坚持打卡</p>
                </div>
              )}
              {stats.completion_percentage >= 80 && (
                <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
                  <span className="text-green-600">🎉</span>
                  <p className="text-green-800 dark:text-green-200">学习进度优秀！继续保持，即将完成学习目标</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-8 rounded-xl border border-amber-200 dark:border-amber-900/50 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-amber-600">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">升级 VIP 解锁高级统计</h3>
          <p className="text-amber-700 dark:text-amber-300 mb-4 text-sm">
            学习效率分析 · 趋势预测 · AI 学习建议 · 详细图表
          </p>
          <Link to="/vip" className="inline-block px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all text-sm font-medium">
            立即升级 VIP
          </Link>
        </div>
      )}
    </div>
  )
}
