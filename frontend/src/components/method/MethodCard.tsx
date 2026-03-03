import { useState, useEffect } from 'react'
import { planService } from '../../services/planService'

interface Method {
  id: number; stage_id: number; method_type: string; title: string;
  content: string; schedule: string; confirmed: boolean;
}

export default function MethodCard({ planId, status, onUpdate }: {
  planId: number; status: string; onUpdate: () => void
}) {
  const [methods, setMethods] = useState<Method[]>([])
  const [loading, setLoading] = useState(false)

  const canGenerate = ['content', 'method'].includes(status)
  const show = ['method', 'active', 'completed'].includes(status)

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
      <h2 className="text-lg font-semibold mb-4">学习方式</h2>
      {methods.length > 0 ? (
        <>
          <div className="space-y-3">
            {methods.map(m => (
              <div key={m.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-brand-500 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded mr-2">{m.method_type}</span>
                    <span className="text-sm font-medium">{m.title}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{m.content}</p>
                {m.schedule && <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">安排：{m.schedule}</p>}
              </div>
            ))}
          </div>
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
