import { useState, useEffect } from 'react'
import { planService } from '../../services/planService'

interface Stage {
  id: number; order_index: number; stage_name: string;
  description: string; duration_days: number; milestones: string; confirmed: boolean;
}

export default function StageList({ planId, status, onUpdate }: {
  planId: number; status: string; onUpdate: () => void
}) {
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(false)

  const canGenerate = ['analysis', 'planning'].includes(status)

  useEffect(() => {
    if (['planning', 'content', 'method', 'active', 'completed'].includes(status)) {
      planService.getStages(planId).then(r => setStages(r.data))
    }
  }, [planId, status])

  const generate = async () => {
    setLoading(true)
    try {
      const res = await planService.generateStages(planId)
      setStages(res.data)
      onUpdate()
    } catch { alert('生成阶段失败') }
    setLoading(false)
  }

  const confirmAll = async () => {
    await planService.confirmAllStages(planId)
    onUpdate()
  }

  if (!canGenerate && stages.length === 0) return null

  const btnPrimary = "px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all"
  const btnOutline = "px-4 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-all"

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-8 mb-6">
      <h2 className="text-lg font-semibold mb-4">学习阶段</h2>
      {stages.length > 0 ? (
        <>
          <div className="space-y-3">
            {stages.map(s => (
              <div key={s.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-5 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{s.order_index + 1}. {s.stage_name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.description}</p>
                    {s.milestones && <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">里程碑：{s.milestones}</p>}
                  </div>
                  <span className="text-xs text-brand-500 dark:text-brand-400 whitespace-nowrap ml-4 bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded-md font-medium">{s.duration_days} 天</span>
                </div>
              </div>
            ))}
          </div>
          {canGenerate && (
            <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
              <button onClick={generate} className={btnOutline}>重新生成</button>
              <button onClick={confirmAll} className={btnPrimary}>确认所有阶段</button>
            </div>
          )}
        </>
      ) : canGenerate ? (
        <button onClick={generate} disabled={loading} className={`${btnPrimary} disabled:opacity-50`}>
          {loading ? 'AI 生成中...' : '生成学习阶段'}
        </button>
      ) : null}
    </div>
  )
}
