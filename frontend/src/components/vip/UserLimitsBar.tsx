import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

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

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800 p-4 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-sm">
              {limits.is_vip ? 'VIP会员' : '免费版'}
            </h3>
            {limits.is_vip && (
              <span className="px-2 py-0.5 rounded-md text-xs bg-amber-500 text-white">VIP</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 学习计划限制 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">学习计划</span>
                <span className="font-medium">
                  {limits.plan_limit.current}
                  {limits.plan_limit.unlimited ? ' (无限制)' : ` / ${limits.plan_limit.max}`}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    planProgress >= 100 ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(planProgress, 100)}%` }}
                />
              </div>
            </div>

            {/* AI使用次数 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">今日AI使用</span>
                <span className="font-medium">
                  {limits.ai_usage.today}
                  {limits.ai_usage.unlimited ? ' (无限制)' : ` / ${limits.ai_usage.daily_limit}`}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    aiProgress >= 100 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(aiProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {!limits.is_vip && (
          <Link
            to="/vip"
            className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all text-sm font-medium whitespace-nowrap">
            升级VIP
          </Link>
        )}
      </div>

      {!limits.is_vip && (
        <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            升级VIP解锁: 无限计划、无限AI使用、数据导出、高级统计、优先支持等更多特权
          </p>
        </div>
      )}
    </div>
  )
}
