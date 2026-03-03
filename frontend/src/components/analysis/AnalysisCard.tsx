import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { planService } from '../../services/planService'

interface Analysis {
  id: number; analysis_result: string; key_points: string;
  recommended_path: string; confirmed: boolean;
}

export default function AnalysisCard({ planId, status, onUpdate }: {
  planId: number; status: string; onUpdate: () => void
}) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canGenerate = status === 'draft' || status === 'analysis'

  useEffect(() => {
    if (status !== 'draft') {
      planService.getAnalysis(planId).then(r => {
        if (r.data) setAnalysis(r.data)
      }).catch(() => {})
    }
  }, [planId, status])

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await planService.generateAnalysis(planId)
      setAnalysis(res.data)
      onUpdate()
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || '生成分析失败'
      if (errorMsg.includes('VIP') || errorMsg.includes('会员')) {
        setError('vip_required')
      } else {
        setError(errorMsg)
      }
    }
    setLoading(false)
  }

  const confirm = async () => {
    if (!analysis) return
    await planService.confirmAnalysis(analysis.id)
    setAnalysis({ ...analysis, confirmed: true })
    onUpdate()
  }

  if (!canGenerate && !analysis) return null

  const btnPrimary = "px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all"
  const btnOutline = "px-4 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-all"

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-8 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">需求分析</h2>
        <span className="px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white">VIP</span>
      </div>

      {error === 'vip_required' && (
        <div className="mb-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500 mt-0.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">此功能需要 VIP 会员</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">升级 VIP 解锁 AI 智能分析功能，享受完整的学习规划体验</p>
              <Link to="/vip" className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300">
                立即升级 VIP →
              </Link>
            </div>
          </div>
        </div>
      )}

      {error && error !== 'vip_required' && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {analysis ? (
        <div className="space-y-4">
          {[
            { label: '分析结果', text: analysis.analysis_result },
            { label: '关键要点', text: analysis.key_points },
            { label: '推荐路径', text: analysis.recommended_path },
          ].map(item => (
            <div key={item.label}>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">{item.label}</span>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
          {!analysis.confirmed && (
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button onClick={generate} className={btnOutline}>重新分析</button>
              <button onClick={confirm} className={btnPrimary}>确认分析</button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={generate} disabled={loading} className={`${btnPrimary} disabled:opacity-50`}>
          {loading ? 'AI 分析中...' : '开始 AI 需求分析'}
        </button>
      )}
    </div>
  )
}
