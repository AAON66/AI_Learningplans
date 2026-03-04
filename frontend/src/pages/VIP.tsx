import { useState, useEffect } from 'react'
import { vipService } from '../services/vipService'

interface VIPStatus {
  is_vip: boolean
  expire_at: string | null
  days_remaining: number | null
}

export default function VIP() {
  const [status, setStatus] = useState<VIPStatus | null>(null)
  const [cardCode, setCardCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadStatus = () => {
    vipService.getStatus()
      .then(r => {
        setStatus(r.data)
        setError('')
      })
      .catch(err => {
        console.error('加载VIP状态失败:', err)
        setError(err.response?.data?.detail || '加载失败，请刷新重试')
        // 设置默认状态，避免一直加载
        setStatus({ is_vip: false, expire_at: null, days_remaining: null })
      })
  }

  useEffect(() => {
    loadStatus()
  }, [])

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardCode.trim()) {
      setMessage('请输入卡密')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await vipService.activate(cardCode)
      setMessage('激活成功！')
      setCardCode('')
      loadStatus()
    } catch (error: any) {
      setMessage(error.response?.data?.detail || '激活失败')
    } finally {
      setLoading(false)
    }
  }

  if (!status) return <div className="text-center py-10 text-gray-400">加载中...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">VIP会员</h1>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* VIP状态卡片 */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl p-8 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">会员状态</h2>
          {status.is_vip && (
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">VIP会员</span>
          )}
        </div>

        {status.is_vip ? (
          <div>
            <p className="text-white/90 mb-2">您的VIP会员正在生效中</p>
            <p className="text-2xl font-bold mb-1">{status.days_remaining} 天</p>
            <p className="text-white/70 text-sm">
              到期时间: {new Date(status.expire_at!).toLocaleDateString('zh-CN')}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-white/90 mb-2">您还不是VIP会员</p>
            <p className="text-white/70 text-sm">激活VIP享受AI智能分析等专属功能</p>
          </div>
        )}
      </div>

      {/* VIP权益 */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <h3 className="font-semibold mb-4">VIP专属权益</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🤖', title: 'AI智能分析', desc: '无限次使用DeepSeek R1进行学习需求分析', free: '每天3次' },
            { icon: '📊', title: '无限学习计划', desc: '创建无限个学习计划', free: '最多3个' },
            { icon: '📚', title: 'AI资源推荐', desc: '智能推荐优质学习资源', free: '有限' },
            { icon: '💡', title: '学习方法建议', desc: '定制化学习方法指导', free: '基础' },
            { icon: '📈', title: '高级统计分析', desc: '详细图表、趋势分析、学习报告', free: '基础统计' },
            { icon: '📥', title: '数据导出', desc: '导出学习数据为PDF/Excel', free: '不可用' },
            { icon: '✨', title: '鼠标特效', desc: '烟花、星星、爱心等炫酷特效', free: '基础特效' },
            { icon: '🏆', title: 'VIP专属徽章', desc: '显示VIP身份标识', free: '无' },
            { icon: '⏰', title: '学习提醒', desc: '邮件和站内消息提醒', free: '无' },
            { icon: '🎯', title: '优先支持', desc: '专属客服通道', free: '普通支持' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <span className="px-2 py-0.5 rounded text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">VIP</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">{item.desc}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">免费版: {item.free}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 激活卡密 */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold mb-4">激活VIP</h3>
        <form onSubmit={handleActivate}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">卡密</label>
            <input
              type="text"
              value={cardCode}
              onChange={e => setCardCode(e.target.value.toUpperCase())}
              placeholder="请输入16位卡密"
              maxLength={16}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.includes('成功')
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white px-4 py-2.5 rounded-lg hover:shadow-lg hover:shadow-brand-500/25 transition-all font-medium disabled:opacity-50">
            {loading ? '激活中...' : '立即激活'}
          </button>
        </form>

        <p className="text-gray-400 dark:text-gray-500 text-xs mt-4 text-center">
          如需购买VIP卡密，请访问
          <a
            href="https://xfk.8u9.top/20387D21"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-500 hover:text-brand-600 ml-1 underline">
            发卡网
          </a>
        </p>
      </div>
    </div>
  )
}
