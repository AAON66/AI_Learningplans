import { useState, useEffect } from 'react'
import { planService } from '../../services/planService'
import api from '../../services/api'
import AILoadingSpinner from '../common/AILoadingSpinner'

interface Stage { id: number; order_index: number; stage_name: string }
interface Resource {
  id: number; stage_id: number; resource_type: string; title: string;
  description: string; url: string; provider: string;
  estimated_hours: number; difficulty: string; is_free: boolean;
}

export default function ResourceCard({ planId, status, stages, onUpdate, isVip: isVipProp }: {
  planId: number; status: string; stages: Stage[]; onUpdate: () => void; isVip?: boolean
}) {
  const [resources, setResources] = useState<Record<number, Resource[]>>({})
  const [loading, setLoading] = useState<number | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [isVipState, setIsVipState] = useState(false)
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set())

  const isVip = isVipProp !== undefined ? isVipProp : isVipState

  const canGenerate = ['content', 'planning'].includes(status)
  const show = ['content', 'method', 'active', 'completed'].includes(status)

  useEffect(() => {
    // 只在没有传入 isVip prop 时才获取 VIP 状态
    if (isVipProp === undefined) {
      api.get('/vip/status')
        .then(r => {
          console.log('[ResourceCard] VIP Status from API:', r.data)
          setIsVipState(r.data.is_vip)
        })
        .catch(err => {
          console.error('[ResourceCard] Failed to get VIP status:', err)
          console.log('[ResourceCard] Setting isVipState to false due to error')
          setIsVipState(false)
        })
    }
  }, [isVipProp])

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

  const toggleExpand = (stageId: number) => {
    setExpandedStages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(stageId)) {
        newSet.delete(stageId)
      } else {
        newSet.add(stageId)
      }
      return newSet
    })
  }

  if (!show && !canGenerate) return null
  if (!canGenerate && !hasResources) return null

  const btnPrimary = "px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-50"
  const btnOutline = "px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-all disabled:opacity-50"

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-8 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">学习资源推荐</h2>
        {isVip && hasResources && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded flex items-center gap-1 animate-pulse">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            VIP完整资源
          </span>
        )}
      </div>
      {stages.map(s => {
        const stageResources = resources[s.id] || []
        const isExpanded = expandedStages.has(s.id)
        const shouldShowAll = isVip || isExpanded
        const displayResources = shouldShowAll ? stageResources : stageResources.slice(0, 2)
        const hiddenCount = stageResources.length - displayResources.length

        // 调试日志
        console.log(`[ResourceCard Debug] Stage ${s.id}:`, {
          isVipProp,
          isVipState,
          isVip,
          isExpanded,
          shouldShowAll,
          totalResources: stageResources.length,
          displayCount: displayResources.length,
          hiddenCount
        })

        return (
          <div key={s.id} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">{s.order_index + 1}. {s.stage_name}</h3>
              {canGenerate && (
                <button onClick={() => recommend(s.id)} disabled={loading === s.id} className={`${btnOutline} disabled:cursor-not-allowed`}>
                  {loading === s.id ? <AILoadingSpinner text="推荐中" size="sm" variant="default" /> : resources[s.id]?.length ? '重新推荐' : '推荐资源'}
                </button>
              )}
            </div>
            {displayResources.map((r, idx) => {
              const isVipExclusive = isVip && idx >= 2
              return (
                <div
                  key={r.id}
                  className={`ml-4 mb-2 p-3 border border-gray-100 dark:border-gray-700 rounded-lg transition-all duration-300 ${
                    isVipExclusive ? 'animate-fadeIn border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/10 dark:to-transparent' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-brand-500 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded mr-2">{r.resource_type}</span>
                      <span className="text-sm font-medium">{r.title}</span>
                      {isVipExclusive && (
                        <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                          <svg className="inline w-3 h-3 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          VIP专享
                        </span>
                      )}
                    </div>
                    {r.estimated_hours && <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{r.estimated_hours}h</span>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{r.description}</p>
                  {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-brand-500 hover:underline mt-1 inline-block">{r.provider || r.url}</a>}
                </div>
              )
            })}
            {hiddenCount > 0 && (
              <div className="ml-4 p-3 border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 rounded-lg animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-700 dark:text-amber-400">
                    {isVip ? `还有 ${hiddenCount} 个资源` : `还有 ${hiddenCount} 个资源，升级VIP查看`}
                  </span>
                  {isVip ? (
                    <button
                      onClick={() => toggleExpand(s.id)}
                      className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                      {isExpanded ? '收起' : '展开全部'}
                      <svg
                        className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2">
                        <path d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                  ) : (
                    <a href="/vip" className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                      立即升级 →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
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
