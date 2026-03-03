import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

interface UserLimits {
  is_vip: boolean
  plan_limit: {
    current: number
    max: number | null
    unlimited: boolean
  }
  ai_usage: {
    today: number
    daily_limit: number | null
    unlimited: boolean
  }
  features: {
    export_data: boolean
    advanced_stats: boolean
    priority_support: boolean
    learning_reminders: boolean
    custom_themes: boolean
    vip_badges: boolean
  }
}

export default function UserLimitsBar() {
  const [limits, setLimits] = useState<UserLimits | null>(null)

  useEffect(() => {
    api.get('/vip/limits').then(r => setLimits(r.data)).catch(() => {})
  }, [])

  if (!limits) return null

  const planProgress = limits.plan_limit.unlimited
    ? 100
    : (limits.plan_limit.current / (limits.plan_limit.max || 1)) * 100

  const aiProgress = limits.ai_usage.unlimited
    ? 100
    : (limits.ai_usage.today / (limits.ai_usage.daily_limit || 1)) * 100

  const CircularProgress = ({
    progress,
    color,
    icon,
    label,
    current,
    max,
    unlimited
  }: {
    progress: number
    color: string
    icon: string
    label: string
    current: number
    max: number | null
    unlimited: boolean
  }) => {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (Math.min(progress, 100) / 100) * circumference

    return (
      <div className="relative flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`${color} transition-all duration-500 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {current}
            </span>
            {!unlimited && max && (
              <span className="text-sm text-gray-500 dark:text-gray-400">/ {max}</span>
            )}
            {unlimited && (
              <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">∞</span>
            )}
          </div>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1.5">
            <span className="text-lg">{icon}</span>
            {label}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
            limits.is_vip
              ? 'bg-gradient-to-br from-amber-400 to-orange-500'
              : 'bg-gradient-to-br from-gray-400 to-gray-500'
          }`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="sm:w-6 sm:h-6">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-100">
              {limits.is_vip ? 'VIP 会员' : '免费版用户'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {limits.is_vip ? '尊享全部特权功能' : '升级解锁更多功能'}
            </p>
          </div>
        </div>
        {!limits.is_vip && (
          <Link
            to="/vip"
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all text-sm font-medium flex items-center justify-center gap-2 group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            升级 VIP
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-8">
        <CircularProgress
          progress={planProgress}
          color={planProgress >= 100 ? 'text-red-500' : 'text-amber-500'}
          icon="📚"
          label="学习计划"
          current={limits.plan_limit.current}
          max={limits.plan_limit.max}
          unlimited={limits.plan_limit.unlimited}
        />

        <div className="hidden sm:block w-px h-32 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

        <CircularProgress
          progress={aiProgress}
          color={aiProgress >= 100 ? 'text-red-500' : 'text-blue-500'}
          icon="🤖"
          label="今日 AI 使用"
          current={limits.ai_usage.today}
          max={limits.ai_usage.daily_limit}
          unlimited={limits.ai_usage.unlimited}
        />
      </div>

      {!limits.is_vip && (
        <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 justify-center">
            {['无限计划', '无限AI', '数据导出', '高级统计', '优先支持', '自定义主题'].map((feature, i) => (
              <span
                key={i}
                className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2.5 sm:px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                ✨ {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
