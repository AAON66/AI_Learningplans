import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { planService } from '../services/planService'
import StatusIndicator from '../components/plan/StatusIndicator'
import AnalysisCard from '../components/analysis/AnalysisCard'
import StageList from '../components/stage/StageList'
import ResourceCard from '../components/resource/ResourceCard'
import MethodCard from '../components/method/MethodCard'
import api from '../services/api'

interface Plan {
  id: number; title: string; goal: string; user_background: string;
  difficulty_level: string; status: string; total_duration_days: number;
}

const DIFFICULTY_MAP: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
  expert: '专家'
}

export default function PlanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const planId = Number(id)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [stages, setStages] = useState<{id: number; order_index: number; stage_name: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isVip, setIsVip] = useState(false)
  const [exporting, setExporting] = useState(false)

  const reload = () => {
    planService.get(planId).then(r => { setPlan(r.data); setLoading(false) })
    planService.getStages(planId).then(r => setStages(r.data)).catch(() => {})
  }

  useEffect(() => {
    reload()
    api.get('/api/v1/vip/status').then(r => setIsVip(r.data.is_vip)).catch(() => {})
  }, [planId])

  if (loading) return <div className="text-center py-10 text-gray-400">加载中...</div>
  if (!plan) return <div className="text-center py-10 text-red-500">计划不存在</div>

  const handleAction = async (action: 'start' | 'pause' | 'complete') => {
    const fn = { start: planService.start, pause: planService.pause, complete: planService.complete }
    await fn[action](planId)
    reload()
  }

  const handleDelete = async () => {
    try {
      await planService.delete(planId)
      navigate('/plans')
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    }
  }

  const handleExport = async () => {
    if (!isVip) {
      alert('数据导出是 VIP 专属功能，请先升级 VIP')
      navigate('/vip')
      return
    }

    setExporting(true)
    try {
      // 简单的文本导出功能
      const exportData = {
        title: plan?.title,
        goal: plan?.goal,
        background: plan?.user_background,
        difficulty: DIFFICULTY_MAP[plan?.difficulty_level || ''] || plan?.difficulty_level,
        duration: plan?.total_duration_days,
        status: plan?.status,
        stages: stages.map(s => s.stage_name),
        exportTime: new Date().toLocaleString('zh-CN')
      }

      const content = `
学习计划导出报告
==================

计划名称：${exportData.title}
学习目标：${exportData.goal}
背景信息：${exportData.background || '无'}
难度等级：${exportData.difficulty}
计划时长：${exportData.duration} 天
当前状态：${exportData.status}

学习阶段：
${exportData.stages.map((s, i) => `${i + 1}. ${s}`).join('\n')}

导出时间：${exportData.exportTime}
导出用户：VIP 会员

---
由智能学习计划系统生成
      `.trim()

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `学习计划-${plan?.title}-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert('导出成功！')
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
    }
    setExporting(false)
  }

  const btnPrimary = "px-4 py-2 rounded-lg text-sm font-medium transition-all"
  const btnOutline = "px-4 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-all"

  return (
    <div>
      <Link to="/plans" className="text-sm text-gray-500 hover:text-brand-500 transition-colors mb-6 inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回列表
      </Link>
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-8 mb-6">
        <h1 className="text-2xl font-bold mb-2">{plan.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-3">{plan.goal}</p>
        {plan.user_background && <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">背景：{plan.user_background}</p>}
        <div className="flex gap-2 text-xs mb-5">
          <span className="bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-md">{DIFFICULTY_MAP[plan.difficulty_level] || plan.difficulty_level}</span>
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 px-3 py-1 rounded-md">{plan.total_duration_days} 天</span>
        </div>
        <StatusIndicator status={plan.status} />
        <div className="flex gap-3 mt-5 flex-wrap">
          {plan.status === 'method' && <button onClick={() => handleAction('start')} className={`${btnPrimary} bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25`}>开始学习</button>}
          {plan.status === 'active' && (
            <>
              <button onClick={() => handleAction('pause')} className={`${btnPrimary} bg-amber-500 text-white hover:bg-amber-600`}>暂停</button>
              <button onClick={() => handleAction('complete')} className={`${btnPrimary} bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25`}>完成</button>
              <Link to={`/plans/${planId}/progress`} className={btnOutline}>记录进度</Link>
              <Link to={`/plans/${planId}/stats`} className={btnOutline}>查看统计</Link>
            </>
          )}
          {isVip ? (
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 rounded-lg text-sm border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center gap-1.5 disabled:opacity-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {exporting ? '导出中...' : '导出数据'}
            </button>
          ) : (
            <button
              onClick={() => navigate('/vip')}
              className="px-4 py-2 rounded-lg text-sm border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              VIP导出
            </button>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-lg text-sm border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ml-auto">
            删除计划
          </button>
        </div>
      </div>
      <AnalysisCard planId={planId} status={plan.status} onUpdate={reload} />
      <StageList planId={planId} status={plan.status} onUpdate={reload} />
      <ResourceCard planId={planId} status={plan.status} stages={stages} onUpdate={reload} />
      <MethodCard planId={planId} status={plan.status} onUpdate={reload} />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">确认删除</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              确定要删除学习计划「{plan.title}」吗？此操作无法撤销，所有相关数据（包括学习阶段、资源、进度记录等）都将被永久删除。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition-all">
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
