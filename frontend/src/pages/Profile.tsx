import { useState, useEffect } from 'react'
import { authService } from '../services/auth'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Profile() {
  const [email, setEmail] = useState(localStorage.getItem('user_email') || '')
  const [createdAt, setCreatedAt] = useState('')
  const [hasQA, setHasQA] = useState(false)
  const [isVip, setIsVip] = useState(false)
  const [vipExpire, setVipExpire] = useState('')

  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')
  const [pwdErr, setPwdErr] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [qaMsg, setQaMsg] = useState('')
  const [qaErr, setQaErr] = useState('')
  const [qaLoading, setQaLoading] = useState(false)

  useEffect(() => {
    authService.getMe().then(r => {
      setEmail(r.data.email)
      if (r.data.created_at) setCreatedAt(new Date(r.data.created_at).toLocaleDateString())
      if (r.data.security_question) {
        setHasQA(true)
        setQuestion(r.data.security_question)
      }
    }).catch(() => {})

    // 获取 VIP 状态
    api.get('/api/v1/vip/status').then(r => {
      setIsVip(r.data.is_vip)
      if (r.data.vip_expire_at) {
        setVipExpire(new Date(r.data.vip_expire_at).toLocaleDateString())
      }
    }).catch(() => {})
  }, [])

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
    } catch (e: any) {
      setPwdErr(e.response?.data?.detail || '修改失败')
    }
    setPwdLoading(false)
  }

  const handleSetQA = async (e: React.FormEvent) => {
    e.preventDefault()
    setQaMsg(''); setQaErr('')
    if (!question.trim() || !answer.trim()) { setQaErr('请填写完整'); return }
    setQaLoading(true)
    try {
      await authService.setSecurityQA(question, answer)
      setQaMsg(hasQA ? '安全问题已更新' : '安全问题设置成功')
      setHasQA(true)
      setAnswer('')
    } catch (e: any) {
      setQaErr(e.response?.data?.detail || '设置失败')
    }
    setQaLoading(false)
  }

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
  const btnPrimary = "w-full py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-50"

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">个人中心</h1>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-base font-medium mb-4">账号信息</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">邮箱</span>
            <span className="text-gray-900 dark:text-gray-100">{email || '加载中...'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">会员状态</span>
            {isVip ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                VIP会员
              </span>
            ) : (
              <span className="text-gray-500">普通用户</span>
            )}
          </div>
          {isVip && vipExpire && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">VIP到期</span>
              <span className="text-amber-600 dark:text-amber-400">{vipExpire}</span>
            </div>
          )}
          {createdAt && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">注册时间</span>
              <span>{createdAt}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">安全问题</span>
            <span className={hasQA ? 'text-green-500' : 'text-orange-500'}>{hasQA ? '已设置' : '未设置'}</span>
          </div>
        </div>
      </div>

      {isVip && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-base font-medium mb-4">VIP 专属功能</h2>
          <Link to="/theme-settings" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">自定义主题</p>
                <p className="text-xs text-gray-500">选择您喜欢的配色方案</p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-base font-medium mb-4">修改密码</h2>
        <form onSubmit={handleChangePwd} className="space-y-4">
          <input type="password" placeholder="当前密码" value={oldPwd} onChange={e => setOldPwd(e.target.value)} className={inputCls} required />
          <input type="password" placeholder="新密码（至少6位）" value={newPwd} onChange={e => setNewPwd(e.target.value)} className={inputCls} required />
          <input type="password" placeholder="确认新密码" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} className={inputCls} required />
          {pwdErr && <p className="text-sm text-red-500">{pwdErr}</p>}
          {pwdMsg && <p className="text-sm text-green-500">{pwdMsg}</p>}
          <button type="submit" disabled={pwdLoading} className={btnPrimary}>{pwdLoading ? '修改中...' : '确认修改'}</button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-base font-medium mb-4">{hasQA ? '更新安全问题' : '设置安全问题'}</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">设置安全问题后可用于找回密码</p>
        <form onSubmit={handleSetQA} className="space-y-4">
          <input type="text" placeholder="安全问题（如：你的宠物叫什么名字？）" value={question} onChange={e => setQuestion(e.target.value)} className={inputCls} required />
          <input type="text" placeholder="你的回答" value={answer} onChange={e => setAnswer(e.target.value)} className={inputCls} required />
          {qaErr && <p className="text-sm text-red-500">{qaErr}</p>}
          {qaMsg && <p className="text-sm text-green-500">{qaMsg}</p>}
          <button type="submit" disabled={qaLoading} className={btnPrimary}>{qaLoading ? '保存中...' : '保存安全问题'}</button>
        </form>
      </div>
    </div>
  )
}
