import { useState, useEffect } from 'react'
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
    try {
      const res = await planService.generateAnalysis(planId)
      setAnalysis(res.data)
      onUpdate()
    } catch { alert('生成分析失败，请检查 API 配置') }
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
      <h2 className="text-lg font-semibold mb-4">需求分析</h2>
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
