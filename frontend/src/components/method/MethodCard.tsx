import { useState, useEffect } from 'react'
import { planService } from '../../services/planService'
import api from '../../services/api'

interface Method {
  id: number; stage_id: number; method_type: string; title: string;
  content: string; schedule: string; confirmed: boolean;
}

export default function MethodCard({ planId, status, onUpdate }: {
  planId: number; status: string; onUpdate: () => void
}) {
  const [methods, setMethods] = useState<Method[]>([])
  const [loading, setLoading] = useState(false)
  const [isVip, setIsVip] = useState(false)

  const canGenerate = ['content', 'method'].includes(status)
  const show = ['method', 'active', 'completed'].includes(status)

  useEffect(() => {
    // 获取 VIP 状态
    api.get('/api/v1/vip/status').then(r => {
      setIsVip(r.data.is_vip)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (show) {
      planService.getMethods(planId).then(r => setMethods(r.data)).catch(() => {})
    }
  }, [planId, status])

  const generate = async () => {
    setLoading(true)
    try {
      const res = await planService.generateMethods(planId)
      setMethods(res.data)
      onUpdate()
    } catch { alert('生成学习方式失败') }
    setLoading(false)
  }

  const confirmAll = async () => {
    await planService.confirmAllMethods(planId)
    onUpdate()
  }

  if (!show && !canGenerate) return null
  if (!canGenerate && methods.length === 0) return null

  const btnPrimary = "px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-50"
  const btnOutline = "px-4 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-all"

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-8 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">学习方式</h2>
        {isVip && methods.length > 0 && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            VIP深度定制
          </span>
        )}
      </div>
      {methods.length > 0 ? (
        <>
          <div className="space-y-3">
            {methods.map((m, idx) => {
              // 非 VIP 用户只显示前 2 个方法的简略版本
              const isHidden = !isVip && idx >= 2
              const isSimplified = !isVip && idx < 2

              if (isHidden) return null

              return (
                <div key={m.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-brand-500 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded mr-2">{m.method_type}</span>
                      <span className="text-sm font-medium">{m.title}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    {isSimplified ? m.content.slice(0, 100) + '...' : m.content}
                  </p>
                  {isSimplified && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      升级VIP查看完整建议
                    </p>
                  )}
                  {!isSimplified && m.schedule && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">安排：{m.schedule}</p>
                  )}
                </div>
              )
            })}
          </div>
          {!isVip && methods.length > 2 && (
            <div className="mt-3 p-3 border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-700 dark:text-amber-400">
                  还有 {methods.length - 2} 个深度学习方法，升级VIP查看
                </span>
                <a href="/vip" className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                  立即升级 →
                </a>
              </div>
            </div>
          )}
          {canGenerate && (
            <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
              <button onClick={generate} className={btnOutline}>重新生成</button>
              <button onClick={confirmAll} className={btnPrimary}>确认并开始学习</button>
            </div>
          )}
        </>
      ) : canGenerate ? (
        <button onClick={generate} disabled={loading} className={btnPrimary}>
          {loading ? 'AI 生成中...' : '生成学习方式'}
        </button>
      ) : null}
    </div>
  )
}
