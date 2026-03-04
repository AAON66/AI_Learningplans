import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { vipService } from '../services/vipService'
import api from '../services/api'

interface VIPCard {
  id: number
  card_code: string
  duration_days: number
  is_used: boolean
  used_by: number | null
  used_at: string | null
  created_at: string
}

export default function AdminVIP() {
  const [cards, setCards] = useState<VIPCard[]>([])
  const [filter, setFilter] = useState<'all' | 'unused' | 'used'>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [durationDays, setDurationDays] = useState(30)
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  // 导出筛选条件
  const [exportDuration, setExportDuration] = useState<number | 'all'>('all')
  const [exportStatus, setExportStatus] = useState<'all' | 'used' | 'unused'>('all')

  useEffect(() => {
    // 检查管理员登录状态
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      navigate('/admin/login')
      return
    }

    // 验证token - 使用axios直接调用,避免被拦截器覆盖
    import('axios').then(({ default: axios }) => {
      axios.get('/api/v1/admin/me', {
        headers: { Authorization: `Bearer ${adminToken}` }
      }).then(() => {
        setIsAuthenticated(true)
      }).catch((err) => {
        console.error('管理员验证失败:', err)
        localStorage.removeItem('admin_token')
        navigate('/admin/login')
      })
    })
  }, [navigate])

  useEffect(() => {
    if (isAuthenticated) {
      loadCards()
    }
  }, [filter, isAuthenticated])

  const loadCards = () => {
    const adminToken = localStorage.getItem('admin_token')
    const params = filter === 'all' ? {} : { is_used: filter === 'used' }

    import('axios').then(({ default: axios }) => {
      axios.get('/api/v1/vip/cards', {
        params,
        headers: { Authorization: `Bearer ${adminToken}` }
      }).then(r => setCards(r.data))
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const adminToken = localStorage.getItem('admin_token')
      const axios = (await import('axios')).default
      await axios.post('/api/v1/vip/cards',
        { duration_days: durationDays, count },
        { headers: { Authorization: `Bearer ${adminToken}` }}
      )
      setMessage(`成功生成 ${count} 张卡密`)
      setShowCreate(false)
      setCount(1)
      loadCards()
    } catch (error: any) {
      setMessage(error.response?.data?.detail || '生成失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这张卡密吗？')) return

    try {
      const adminToken = localStorage.getItem('admin_token')
      const axios = (await import('axios')).default
      await axios.delete(`/api/v1/vip/cards/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      loadCards()
    } catch (error: any) {
      alert(error.response?.data?.detail || '删除失败')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const handleExport = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token')
      const axios = (await import('axios')).default

      // 获取所有卡密
      const response = await axios.get('/api/v1/vip/cards', {
        params: { limit: 1000 },
        headers: { Authorization: `Bearer ${adminToken}` }
      })

      let filteredCards = response.data

      // 按天数筛选
      if (exportDuration !== 'all') {
        filteredCards = filteredCards.filter((c: VIPCard) => c.duration_days === exportDuration)
      }

      // 按状态筛选
      if (exportStatus !== 'all') {
        filteredCards = filteredCards.filter((c: VIPCard) =>
          exportStatus === 'used' ? c.is_used : !c.is_used
        )
      }

      if (filteredCards.length === 0) {
        alert('没有符合条件的卡密')
        return
      }

      // 生成导出内容
      const headers = ['卡密', '有效天数', '状态', '使用者ID', '使用时间', '创建时间']
      const csvContent = [
        headers.join('|'),
        ...filteredCards.map((card: VIPCard) => [
          String(card.card_code),
          String(card.duration_days),
          card.is_used ? '已使用' : '未使用',
          card.used_by ? String(card.used_by) : '',
          card.used_at ? new Date(card.used_at).toLocaleString('zh-CN') : '',
          new Date(card.created_at).toLocaleString('zh-CN')
        ].join('|'))
      ].join('\n')

      // 添加BOM以支持中文
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      const filename = `VIP卡密_${exportDuration === 'all' ? '全部' : exportDuration + '天'}_${
        exportStatus === 'all' ? '全部' : exportStatus === 'used' ? '已使用' : '未使用'
      }_${new Date().toISOString().split('T')[0]}.csv`

      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setMessage(`成功导出 ${filteredCards.length} 张卡密`)
      setShowExport(false)
    } catch (error: any) {
      alert(error.response?.data?.detail || '导出失败')
    }
  }

  if (!isAuthenticated) {
    return <div className="text-center py-10 text-gray-400">验证中...</div>
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage('已复制到剪贴板')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">VIP卡密管理</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium">
            返回看板
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-brand-500/25 transition-all text-sm font-medium">
            生成卡密
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all text-sm font-medium">
            导出卡密
          </button>
          <button
            onClick={handleLogout}
            className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium">
            退出登录
          </button>
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: '全部' },
          { key: 'unused', label: '未使用' },
          { key: 'used', label: '已使用' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
              filter === f.key
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-300 dark:hover:border-brand-700'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
          {message}
        </div>
      )}

      {/* 卡密列表 */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">卡密</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">天数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">创建时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {cards.map(card => (
              <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">{card.card_code}</code>
                    <button
                      onClick={() => copyToClipboard(card.card_code)}
                      className="text-gray-400 hover:text-brand-500 transition-colors"
                      title="复制">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{card.duration_days} 天</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-md text-xs ${
                    card.is_used
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                      : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  }`}>
                    {card.is_used ? '已使用' : '未使用'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(card.created_at).toLocaleString('zh-CN')}
                </td>
                <td className="px-4 py-3">
                  {!card.is_used && (
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="text-red-600 hover:text-red-700 text-sm transition-colors">
                      删除
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cards.length === 0 && (
          <div className="text-center py-10 text-gray-400">暂无卡密</div>
        )}
      </div>

      {/* 生成卡密弹窗 */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">生成VIP卡密</h3>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">有效天数</label>
                <select
                  value={durationDays}
                  onChange={e => setDurationDays(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value={7}>7天</option>
                  <option value={30}>30天</option>
                  <option value={90}>90天</option>
                  <option value={180}>180天</option>
                  <option value={365}>365天</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">生成数量</label>
                <input
                  type="number"
                  value={count}
                  onChange={e => setCount(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg text-sm bg-brand-600 text-white hover:bg-brand-700 transition-all disabled:opacity-50">
                  {loading ? '生成中...' : '确认生成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 导出卡密弹窗 */}
      {showExport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowExport(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">导出VIP卡密</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">有效天数</label>
                <select
                  value={String(exportDuration)}
                  onChange={e => setExportDuration(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="all">全部天数</option>
                  <option value="7">7天</option>
                  <option value="30">30天</option>
                  <option value="90">90天</option>
                  <option value="180">180天</option>
                  <option value="365">365天</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">使用状态</label>
                <select
                  value={exportStatus}
                  onChange={e => setExportStatus(e.target.value as 'all' | 'used' | 'unused')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="all">全部状态</option>
                  <option value="unused">未使用</option>
                  <option value="used">已使用</option>
                </select>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  将导出为CSV文件，包含卡密、有效天数、状态、使用信息等
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowExport(false)}
                  className="px-4 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  取消
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition-all">
                  确认导出
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
