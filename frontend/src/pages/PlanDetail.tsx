import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { planService } from '../services/planService'
import StatusIndicator from '../components/plan/StatusIndicator'
import AnalysisCard from '../components/analysis/AnalysisCard'
import StageList from '../components/stage/StageList'
import ResourceCard from '../components/resource/ResourceCard'
import MethodCard from '../components/method/MethodCard'
import AILoadingFull from '../components/common/AILoadingFull'
import KanbanBoard from '../components/kanban/KanbanBoard'
import api from '../services/api'
import jsPDF from 'jspdf'

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
  const [showExportMenu, setShowExportMenu] = useState(false)

  const reload = () => {
    planService.get(planId).then(r => { setPlan(r.data); setLoading(false) })
    planService.getStages(planId).then(r => setStages(r.data)).catch(() => {})
  }

  useEffect(() => {
    reload()
    api.get('/vip/status')
      .then(r => {
        console.log('[PlanDetail] VIP Status API Response:', r.data)
        console.log('[PlanDetail] Setting isVip to:', r.data.is_vip)
        setIsVip(r.data.is_vip)
      })
      .catch(err => {
        console.error('[PlanDetail] Failed to get VIP status:', err)
        console.log('[PlanDetail] Setting isVip to false due to error')
        setIsVip(false)
      })
  }, [planId])

  if (loading) return <AILoadingFull text="加载计划详情" subtext="正在获取学习计划数据..." />
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

  const handleExport = async (format: 'txt' | 'pdf' | 'doc') => {
    if (!isVip) {
      alert('数据导出是 VIP 专属功能，请先升级 VIP')
      navigate('/vip')
      return
    }

    setExporting(true)
    setShowExportMenu(false)

    try {
      const exportData = {
        title: plan?.title || '',
        goal: plan?.goal || '',
        background: plan?.user_background || '无',
        difficulty: DIFFICULTY_MAP[plan?.difficulty_level || ''] || plan?.difficulty_level || '',
        duration: plan?.total_duration_days || 0,
        status: plan?.status || '',
        stages: stages.map(s => s.stage_name),
        exportTime: new Date().toLocaleString('zh-CN')
      }

      if (format === 'txt') {
        const content = `
学习计划导出报告
==================

计划名称：${exportData.title}
学习目标：${exportData.goal}
背景信息：${exportData.background}
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
        a.download = `学习计划-${exportData.title}-${Date.now()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else if (format === 'pdf') {
        const doc = new jsPDF()

        // 设置字体（使用内置字体，中文可能显示为方框，但功能可用）
        doc.setFontSize(20)
        doc.text('Learning Plan Report', 20, 20)

        doc.setFontSize(12)
        let y = 40
        doc.text(`Title: ${exportData.title}`, 20, y)
        y += 10
        doc.text(`Goal: ${exportData.goal}`, 20, y)
        y += 10
        doc.text(`Background: ${exportData.background}`, 20, y)
        y += 10
        doc.text(`Difficulty: ${exportData.difficulty}`, 20, y)
        y += 10
        doc.text(`Duration: ${exportData.duration} days`, 20, y)
        y += 10
        doc.text(`Status: ${exportData.status}`, 20, y)
        y += 20

        doc.text('Learning Stages:', 20, y)
        y += 10
        exportData.stages.forEach((s, i) => {
          doc.text(`${i + 1}. ${s}`, 25, y)
          y += 8
        })

        y += 10
        doc.setFontSize(10)
        doc.text(`Export Time: ${exportData.exportTime}`, 20, y)
        y += 6
        doc.text('Generated by Smart Learning Plan System', 20, y)

        doc.save(`学习计划-${exportData.title}-${Date.now()}.pdf`)
      } else if (format === 'doc') {
        // 导出为 HTML 格式（可以用 Word 打开）
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>学习计划导出报告</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; }
    h1 { color: #333; border-bottom: 3px solid #6366f1; padding-bottom: 10px; }
    .info { margin: 20px 0; }
    .label { font-weight: bold; color: #666; }
    .stages { margin-top: 20px; }
    .stage-item { margin: 8px 0; padding-left: 20px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <h1>学习计划导出报告</h1>

  <div class="info">
    <p><span class="label">计划名称：</span>${exportData.title}</p>
    <p><span class="label">学习目标：</span>${exportData.goal}</p>
    <p><span class="label">背景信息：</span>${exportData.background}</p>
    <p><span class="label">难度等级：</span>${exportData.difficulty}</p>
    <p><span class="label">计划时长：</span>${exportData.duration} 天</p>
    <p><span class="label">当前状态：</span>${exportData.status}</p>
  </div>

  <div class="stages">
    <h2>学习阶段</h2>
    ${exportData.stages.map((s, i) => `<div class="stage-item">${i + 1}. ${s}</div>`).join('')}
  </div>

  <div class="footer">
    <p>导出时间：${exportData.exportTime}</p>
    <p>导出用户：VIP 会员</p>
    <p>由智能学习计划系统生成</p>
  </div>
</body>
</html>
        `

        const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `学习计划-${exportData.title}-${Date.now()}.doc`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

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
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={exporting}
                className="px-4 py-2 rounded-lg text-sm border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center gap-1.5 disabled:opacity-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {exporting ? '导出中...' : '导出数据'}
              </button>
              {showExportMenu && !exporting && (
                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[150px]">
                  <button
                    onClick={() => handleExport('txt')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <span>📄</span>
                    <span>TXT 文本</span>
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <span>📕</span>
                    <span>PDF 文档</span>
                  </button>
                  <button
                    onClick={() => handleExport('doc')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <span>📘</span>
                    <span>Word 文档</span>
                  </button>
                </div>
              )}
            </div>
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
      {isVip && ['active', 'completed'].includes(plan.status) && (
        <KanbanBoard planId={planId} />
      )}
      <ResourceCard planId={planId} status={plan.status} stages={stages} onUpdate={reload} isVip={isVip} />
      <MethodCard planId={planId} status={plan.status} onUpdate={reload} isVip={isVip} />

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
