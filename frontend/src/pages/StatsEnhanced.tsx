import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { planService } from '../services/planService'
import api from '../services/api'
import AILoadingFull from '../components/common/AILoadingFull'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export default function StatsEnhanced() {
  const { id } = useParams()
  const planId = Number(id)
  const [stats, setStats] = useState<any>(null)
  const [isVip, setIsVip] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      planService.getStats(planId),
      api.get('/vip/status')
    ]).then(([statsRes, vipRes]) => {
      setStats(statsRes.data)
      setIsVip(vipRes.data.is_vip)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [planId])

  if (loading) return <AILoadingFull text="加载统计数据" subtext="正在分析学习数据..." />
  if (!stats) return <div className="text-center py-10 text-red-500">加载失败</div>

  const cards = [
    { label: '总学习时长', value: `${Math.floor(stats.total_study_minutes / 60)}h ${stats.total_study_minutes % 60}m`, color: 'from-brand-500 to-brand-600', textColor: 'text-brand-600 dark:text-brand-400', icon: '📚' },
    { label: '打卡天数', value: stats.total_check_ins, color: 'from-green-500 to-emerald-600', textColor: 'text-green-600 dark:text-green-400', icon: '✅' },
    { label: '连续天数', value: stats.consecutive_days, color: 'from-amber-500 to-orange-600', textColor: 'text-amber-600 dark:text-amber-400', icon: '🔥' },
    { label: '完成度', value: `${stats.completion_percentage.toFixed(1)}%`, color: 'from-violet-500 to-purple-600', textColor: 'text-violet-600 dark:text-violet-400', icon: '🎯' },
  ]

  // VIP 专属高级指标
  const avgDailyMinutes = stats.total_check_ins > 0 ? Math.round(stats.total_study_minutes / stats.total_check_ins) : 0
  const efficiency = stats.completion_percentage > 0 ? Math.min(100, Math.round((stats.completion_percentage / (stats.total_check_ins || 1)) * 10)) : 0

  // 图表颜色
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

  // 学习时长分布数据
  const studyDistribution = [
    { name: '< 30分钟', value: stats.daily_data?.filter((d: any) => d.minutes < 30).length || 0 },
    { name: '30-60分钟', value: stats.daily_data?.filter((d: any) => d.minutes >= 30 && d.minutes < 60).length || 0 },
    { name: '60-120分钟', value: stats.daily_data?.filter((d: any) => d.minutes >= 60 && d.minutes < 120).length || 0 },
    { name: '> 120分钟', value: stats.daily_data?.filter((d: any) => d.minutes >= 120).length || 0 },
  ].filter(item => item.value > 0)

  return (
    <div>
      <Link to={`/plans/${planId}`} className="text-sm text-gray-500 hover:text-brand-500 transition-colors mb-6 inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回详情
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">学习统计分析</h1>
        {isVip && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full flex items-center gap-1 animate-pulse">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            VIP高级统计
          </span>
        )}
      </div>

      {/* 基础统计卡片 */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {cards.map(c => (
          <div key={c.label} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 dark:text-gray-500 text-sm">{c.label}</p>
              <span className="text-2xl">{c.icon}</span>
            </div>
            <p className={`text-3xl font-bold ${c.textColor}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {isVip ? (
        <>
          {/* 学习趋势图表 */}
          <div className="grid gap-5 md:grid-cols-2 mb-6">
            {/* 每日学习时长趋势 */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
                  <path d="M3 3v18h18"/><path d="M18 17l-5-5-3 3-5-5"/>
                </svg>
                每日学习时长（最近30天）
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={stats.daily_data || []}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Area type="monotone" dataKey="minutes" stroke="#6366f1" fillOpacity={1} fill="url(#colorMinutes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 每周统计对比 */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                每周学习对比
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.weekly_stats || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Legend />
                  <Bar dataKey="minutes" fill="#10b981" name="学习时长(分钟)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="checkins" fill="#8b5cf6" name="打卡次数" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 进度趋势和学习分布 */}
          <div className="grid gap-5 md:grid-cols-2 mb-6">
            {/* 完成度趋势 */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-500">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                完成度趋势
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats.progress_history || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Line type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} name="完成度(%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 学习时长分布 */}
            {studyDistribution.length > 0 && (
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  学习时长分布
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={studyDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {studyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 学习效率分析 */}
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
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500" style={{ width: `${Math.min(100, (avgDailyMinutes / 120) * 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-amber-700 dark:text-amber-300">学习效率指数</span>
                    <span className="font-semibold text-amber-900 dark:text-amber-100">{efficiency}%</span>
                  </div>
                  <div className="h-2 bg-amber-200 dark:bg-amber-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500" style={{ width: `${efficiency}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-violet-200 dark:border-violet-900/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-violet-900 dark:text-violet-100">学习趋势评估</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-600">
                  <path d="M3 3v18h18"/><path d="M18 17l-5-5-3 3-5-5"/>
                </svg>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-violet-700 dark:text-violet-300">坚持度</span>
                  <span className="font-semibold text-violet-900 dark:text-violet-100">
                    {stats.consecutive_days >= 7 ? '🏆 优秀' : stats.consecutive_days >= 3 ? '👍 良好' : '💪 需加油'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700 dark:text-violet-300">进度评估</span>
                  <span className="font-semibold text-violet-900 dark:text-violet-100">
                    {stats.completion_percentage >= 80 ? '🚀 超前' : stats.completion_percentage >= 50 ? '✅ 正常' : '⏰ 偏慢'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700 dark:text-violet-300">预计完成</span>
                  <span className="font-semibold text-violet-900 dark:text-violet-100">
                    {stats.completion_percentage > 0 && stats.total_check_ins > 0
                      ? `📅 ${Math.ceil((100 - stats.completion_percentage) / (stats.completion_percentage / stats.total_check_ins))} 天`
                      : '⏳ 未知'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI 学习建议 */}
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              AI 智能学习建议
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {avgDailyMinutes < 60 && (
                <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-900/30">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">增加学习时长</p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">建议每日学习60分钟以上，提高学习效率和知识留存率</p>
                  </div>
                </div>
              )}
              {stats.consecutive_days < 3 && (
                <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">保持连续学习</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">连续学习可提高知识留存率，建议每天坚持打卡</p>
                  </div>
                </div>
              )}
              {stats.completion_percentage >= 80 && (
                <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100 mb-1">学习进度优秀</p>
                    <p className="text-sm text-green-800 dark:text-green-200">继续保持当前节奏，即将完成学习目标！</p>
                  </div>
                </div>
              )}
              {avgDailyMinutes >= 60 && stats.consecutive_days >= 7 && (
                <div className="flex gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-900/30">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-medium text-purple-900 dark:text-purple-100 mb-1">学习状态极佳</p>
                    <p className="text-sm text-purple-800 dark:text-purple-200">保持优秀的学习习惯，可以尝试更高难度的内容</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-12 rounded-xl border border-amber-200 dark:border-amber-900/50 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-amber-600">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3">升级 VIP 解锁高级统计分析</h3>
          <p className="text-amber-700 dark:text-amber-300 mb-6 text-sm max-w-md mx-auto">
            📊 详细图表 · 📈 趋势分析 · 🤖 AI 学习建议 · 📉 效率评估 · 🎯 智能预测
          </p>
          <Link to="/vip" className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all text-sm font-medium">
            立即升级 VIP
          </Link>
        </div>
      )}
    </div>
  )
}
