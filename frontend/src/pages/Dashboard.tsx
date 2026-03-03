import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface DashboardStats {
  users: {
    total: number
    vip_count: number
    vip_ratio: number
    recent_7days: number
    active_30days: number
  }
  plans: {
    total: number
    completed: number
    active: number
    paused: number
    draft: number
    completion_rate: number
    recent_7days: number
  }
  cards: {
    total: number
    used: number
    unused: number
    usage_rate: number
  }
  difficulty: Record<string, number>
}

interface UserItem {
  id: number
  email: string
  is_vip: boolean
  vip_expire: string | null
  plan_count: number
  created_at: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      navigate('/admin/login')
      return
    }

    // 验证token
    axios.get('/api/v1/admin/me', {
      headers: { Authorization: `Bearer ${adminToken}` }
    }).then(() => {
      setIsAuthenticated(true)
      loadData()
    }).catch(() => {
      localStorage.removeItem('admin_token')
      navigate('/admin/login')
    })
  }, [navigate])

  const loadData = async () => {
    const adminToken = localStorage.getItem('admin_token')
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/v1/dashboard/stats', {
          headers: { Authorization: `Bearer ${adminToken}` }
        }),
        axios.get('/api/v1/dashboard/users?limit=10', {
          headers: { Authorization: `Bearer ${adminToken}` }
        })
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  if (!isAuthenticated || loading) {
    return <div className="text-center py-10 text-gray-400">加载中...</div>
  }

  if (!stats) {
    return <div className="text-center py-10 text-red-500">加载失败</div>
  }

  const StatCard = ({ title, value, subtitle, icon, color }: any) => (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">数据看板</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/vip')}
            className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium">
            VIP管理
          </button>
          <button
            onClick={handleLogout}
            className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium">
            退出登录
          </button>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="总用户数"
          value={stats.users.total}
          subtitle={`最近7天新增 ${stats.users.recent_7days} 人`}
          color="bg-blue-100 dark:bg-blue-900/20"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 dark:text-blue-400"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>}
        />
        <StatCard
          title="VIP会员"
          value={stats.users.vip_count}
          subtitle={`占比 ${stats.users.vip_ratio}%`}
          color="bg-amber-100 dark:bg-amber-900/20"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-amber-600 dark:text-amber-400"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
        />
        <StatCard
          title="学习计划"
          value={stats.plans.total}
          subtitle={`最近7天新增 ${stats.plans.recent_7days} 个`}
          color="bg-green-100 dark:bg-green-900/20"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600 dark:text-green-400"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
        />
        <StatCard
          title="完成率"
          value={`${stats.plans.completion_rate}%`}
          subtitle={`已完成 ${stats.plans.completed} 个计划`}
          color="bg-purple-100 dark:bg-purple-900/20"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600 dark:text-purple-400"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>}
        />
      </div>

      {/* 详细统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 计划状态分布 */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold mb-4">计划状态分布</h3>
          <div className="space-y-3">
            {[
              { label: '进行中', value: stats.plans.active, color: 'bg-brand-500' },
              { label: '已完成', value: stats.plans.completed, color: 'bg-green-500' },
              { label: '已暂停', value: stats.plans.paused, color: 'bg-amber-500' },
              { label: '草稿', value: stats.plans.draft, color: 'bg-gray-400' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${(item.value / stats.plans.total * 100) || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VIP卡密统计 */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold mb-4">VIP卡密统计</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">总卡密数</span>
              <span className="text-2xl font-bold">{stats.cards.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">已使用</span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">{stats.cards.used}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">未使用</span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{stats.cards.unused}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">使用率</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">{stats.cards.usage_rate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 最近用户 */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold">最近注册用户</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">VIP状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">计划数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">注册时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm">{user.id}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    {user.is_vip ? (
                      <span className="px-2 py-1 rounded-md text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                        VIP会员
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
                        普通用户
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{user.plan_count}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('zh-CN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
