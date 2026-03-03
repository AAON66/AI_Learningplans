import { useState, useEffect } from 'react'
import { planService } from '../../services/planService'

interface Stage { id: number; order_index: number; stage_name: string }
interface Resource {
  id: number; stage_id: number; resource_type: string; title: string;
  description: string; url: string; provider: string;
  estimated_hours: number; difficulty: string; is_free: boolean;
}

export default function ResourceCard({ planId, status, stages, onUpdate }: {
  planId: number; status: string; stages: Stage[]; onUpdate: () => void
}) {
  const [resources, setResources] = useState<Record<number, Resource[]>>({})
  const [loading, setLoading] = useState<number | null>(null)
  const [confirming, setConfirming] = useState(false)

  const canGenerate = ['content', 'planning'].includes(status)
  const show = ['content', 'method', 'active', 'completed'].includes(status)

  useEffect(() => {
    if (show && stages.length > 0) {
      stages.forEach(s => {
        planService.getResources(s.id).then(r => {
          if (r.data.length > 0) setResources(prev => ({ ...prev, [s.id]: r.data }))
        })
      })
    }
  }, [planId, status, stages.length])

  const hasResources = Object.values(resources).some(r => r.length > 0)

  const recommend = async (stageId: number) => {
    setLoading(stageId)
    try {
      const res = await planService.recommendResources(stageId)
      setResources(prev => ({ ...prev, [stageId]: res.data }))
      onUpdate()
    } catch { alert('推荐资源失败') }
    setLoading(null)
  }

  const confirmAll = async () => {
    setConfirming(true)
    try {
      await planService.confirmAllResourcesPlan(planId)
      onUpdate()
    } catch { alert('确认失败') }
    setConfirming(false)
  }

  if (!show && !canGenerate) return null
  if (!canGenerate && !hasResources) return null

  const btnPrimary = "px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-50"
  const btnOutline = "px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-all disabled:opacity-50"

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-8 mb-6">
      <h2 className="text-lg font-semibold mb-4">学习资源推荐</h2>
      {stages.map(s => (
        <div key={s.id} className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">{s.order_index + 1}. {s.stage_name}</h3>
            {canGenerate && (
              <button onClick={() => recommend(s.id)} disabled={loading === s.id} className={btnOutline}>
                {loading === s.id ? '推荐中...' : resources[s.id]?.length ? '重新推荐' : '推荐资源'}
              </button>
            )}
          </div>
          {resources[s.id]?.map(r => (
            <div key={r.id} className="ml-4 mb-2 p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-brand-500 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded mr-2">{r.resource_type}</span>
                  <span className="text-sm font-medium">{r.title}</span>
                </div>
                {r.estimated_hours && <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{r.estimated_hours}h</span>}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{r.description}</p>
              {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-brand-500 hover:underline mt-1 inline-block">{r.provider || r.url}</a>}
            </div>
          ))}
        </div>
      ))}
      {canGenerate && hasResources && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button onClick={confirmAll} disabled={confirming} className={btnPrimary}>
            {confirming ? '确认中...' : '确认所有资源，进入下一步'}
          </button>
        </div>
      )}
    </div>
  )
}
