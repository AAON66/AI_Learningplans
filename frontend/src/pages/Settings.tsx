import { useState, useEffect } from 'react'
import { authService } from '../services/auth'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

const THEMES = [
  { id: 'default', name: '默认蓝', colors: 'from-blue-500 to-blue-600', free: true },
  { id: 'purple', name: '优雅紫', colors: 'from-purple-500 to-purple-600', free: false },
  { id: 'green', name: '清新绿', colors: 'from-green-500 to-green-600', free: false },
  { id: 'orange', name: '活力橙', colors: 'from-orange-500 to-orange-600', free: false },
  { id: 'pink', name: '浪漫粉', colors: 'from-pink-500 to-pink-600', free: false },
  { id: 'teal', name: '海洋青', colors: 'from-teal-500 to-teal-600', free: false },
]

export default function Settings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'account' | 'theme' | 'security'>('account')

  // 账号信息
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [createdAt, setCreatedAt] = useState('')
  const [isVip, setIsVip] = useState(false)
  const [vipExpire, setVipExpire] = useState('')

  // 用户名编辑
  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [usernameMsg, setUsernameMsg] = useState('')

  // 密码修改
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')
  const [pwdErr, setPwdErr] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)

  // 安全问题
  const [hasQA, setHasQA] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [qaMsg, setQaMsg] = useState('')
  const [qaErr, setQaErr] = useState('')
  const [qaLoading, setQaLoading] = useState(false)

  // 主题设置
  const [currentTheme, setCurrentTheme] = useState('default')

  useEffect(() => {
    // 获取用户信息
    authService.getMe().then(r => {
      setEmail(r.data.email)
      setUsername(r.data.username || '')
      setNewUsername(r.data.username || '')
      if (r.data.created_at) setCreatedAt(new Date(r.data.created_at).toLocaleDateString())
      if (r.data.security_question) {
        setHasQA(true)
        setQuestion(r.data.security_question)
      }
    }).catch(() => {})

    // 获取 VIP 状态
    api.get('/vip/status').then(r => {
      setIsVip(r.data.is_vip)
      if (r.data.expire_at) {
        setVipExpire(new Date(r.data.expire_at).toLocaleDateString())
      }
    }).catch(() => setIsVip(false))

    // 获取当前主题
    const saved = localStorage.getItem('color-theme') || 'default'
    setCurrentTheme(saved)
  }, [])

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) {
      setUsernameMsg('用户名不能为空')
      return
    }
    try {
      await api.put('/auth/me', { username: newUsername.trim() })
      setUsername(newUsername.trim())
      setEditingUsername(false)
      setUsernameMsg('用户名更新成功')
      setTimeout(() => setUsernameMsg(''), 3000)
    } catch {
      setUsernameMsg('更新失败，请重试')
    }
  }

  const handleChangePwd = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMsg(''); setPwdErr('')
    if (newPwd !== confirmPwd) { setPwdErr('两次输入的新密码不一致'); return }
    if (newPwd.length < 6) { setPwdErr('新密码至少6位'); return }
    setPwdLoading(true)
    try {
      await authService.changePassword(oldPwd, newPwd)
      setPwdMsg('密码修改成功')
      setOldPwd(''); setNewPwd(''); setConfirmPwd('')
    } catch {
      setPwdErr('修改失败，请检查旧密码是否正确')
    }
    setPwdLoading(false)
  }

  const handleSetQA = async (e: React.FormEvent) => {
    e.preventDefault()
    setQaMsg(''); setQaErr('')
    if (!question.trim() || !answer.trim()) { setQaErr('请填写完整信息'); return }
    setQaLoading(true)
    try {
      await authService.setSecurityQA(question, answer)
      setQaMsg('安全问题设置成功')
      setHasQA(true)
      setAnswer('')
    } catch {
      setQaErr('设置失败，请重试')
    }
    setQaLoading(false)
  }

  const handleThemeChange = (themeId: string, isFree: boolean) => {
    if (!isFree && !isVip) {
      navigate('/vip')
      return
    }
    setCurrentTheme(themeId)
    localStorage.setItem('color-theme', themeId)
    window.location.reload()
  }

  const tabs = [
    { id: 'account' as const, name: '账号设置', icon: '👤' },
    { id: 'theme' as const, name: '主题设置', icon: '🎨' },
    { id: 'security' as const, name: '安全设置', icon: '🔒' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">设置</h1>

      {/* 标签页导航 */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}>
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"></div>
            )}
          </button>
        ))}
      </div>

      {/* 账号设置 */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">邮箱</label>
                <p className="text-gray-900 dark:text-gray-100">{email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">用户名</label>
                {editingUsername ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="输入用户名"
                    />
                    <button
                      onClick={handleUsernameUpdate}
                      className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setEditingUsername(false)
                        setNewUsername(username)
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      取消
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-900 dark:text-gray-100">{username || '未设置'}</p>
                    <button
                      onClick={() => setEditingUsername(true)}
                      className="text-sm text-brand-500 hover:underline">
                      编辑
                    </button>
                  </div>
                )}
                {usernameMsg && <p className="text-sm text-green-600 mt-1">{usernameMsg}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">注册时间</label>
                <p className="text-gray-900 dark:text-gray-100">{createdAt}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">VIP 状态</label>
                <div className="flex items-center gap-2 mt-1">
                  {isVip ? (
                    <>
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
                        VIP 会员
                      </span>
                      {vipExpire && <span className="text-sm text-gray-500">到期时间：{vipExpire}</span>}
                    </>
                  ) : (
                    <>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                        普通用户
                      </span>
                      <button
                        onClick={() => navigate('/vip')}
                        className="text-sm text-brand-500 hover:underline">
                        升级 VIP
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主题设置 */}
      {activeTab === 'theme' && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">选择主题</h2>
          {!isVip && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                🌟 升级 VIP 解锁所有主题配色
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id, theme.free)}
                disabled={!theme.free && !isVip}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  currentTheme === theme.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } ${!theme.free && !isVip ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className={`w-full h-16 rounded-lg bg-gradient-to-r ${theme.colors} mb-3`}></div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{theme.name}</p>
                {!theme.free && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded">
                    VIP
                  </span>
                )}
                {currentTheme === theme.id && (
                  <div className="absolute top-2 left-2 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 安全设置 */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* 修改密码 */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">修改密码</h2>
            <form onSubmit={handleChangePwd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">旧密码</label>
                <input
                  type="password"
                  value={oldPwd}
                  onChange={e => setOldPwd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">新密码</label>
                <input
                  type="password"
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">确认新密码</label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              {pwdMsg && <p className="text-sm text-green-600">{pwdMsg}</p>}
              {pwdErr && <p className="text-sm text-red-600">{pwdErr}</p>}
              <button
                type="submit"
                disabled={pwdLoading}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50">
                {pwdLoading ? '修改中...' : '修改密码'}
              </button>
            </form>
          </div>

          {/* 安全问题 */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">安全问题</h2>
            <form onSubmit={handleSetQA} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">安全问题</label>
                <input
                  type="text"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="例如：我的小学名称是？"
                  disabled={hasQA}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">答案</label>
                <input
                  type="text"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="输入答案"
                  required
                />
              </div>
              {qaMsg && <p className="text-sm text-green-600">{qaMsg}</p>}
              {qaErr && <p className="text-sm text-red-600">{qaErr}</p>}
              <button
                type="submit"
                disabled={qaLoading}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50">
                {qaLoading ? '设置中...' : hasQA ? '更新安全问题' : '设置安全问题'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
