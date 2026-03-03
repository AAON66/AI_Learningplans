import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/auth'

export default function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'answer' | 'done'>('email')
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
  const btnPrimary = "w-full py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-50"

  const fetchQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      const r = await authService.getSecurityQuestion(email)
      setQuestion(r.data.question)
      setStep('answer')
    } catch (e: any) {
      setErr(e.response?.data?.detail || '未找到该账号或未设置安全问题')
    }
    setLoading(false)
  }

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (newPwd !== confirmPwd) { setErr('两次密码不一致'); return }
    if (newPwd.length < 6) { setErr('密码至少6位'); return }
    setLoading(true)
    try {
      await authService.forgotPassword(email, answer, newPwd)
      setStep('done')
    } catch (e: any) {
      setErr(e.response?.data?.detail || '重置失败')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
        <h1 className="text-xl font-semibold mb-6 text-center">找回密码</h1>

        {step === 'email' && (
          <form onSubmit={fetchQuestion} className="space-y-4">
            <input type="email" placeholder="请输入注册邮箱" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} required />
            {err && <p className="text-sm text-red-500">{err}</p>}
            <button type="submit" disabled={loading} className={btnPrimary}>{loading ? '查询中...' : '下一步'}</button>
          </form>
        )}

        {step === 'answer' && (
          <form onSubmit={resetPassword} className="space-y-4">
            <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-sm text-brand-700 dark:text-brand-300">{question}</div>
            <input type="text" placeholder="你的回答" value={answer} onChange={e => setAnswer(e.target.value)} className={inputCls} required />
            <input type="password" placeholder="新密码（至少6位）" value={newPwd} onChange={e => setNewPwd(e.target.value)} className={inputCls} required />
            <input type="password" placeholder="确认新密码" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} className={inputCls} required />
            {err && <p className="text-sm text-red-500">{err}</p>}
            <button type="submit" disabled={loading} className={btnPrimary}>{loading ? '重置中...' : '重置密码'}</button>
          </form>
        )}

        {step === 'done' && (
          <div className="text-center space-y-4">
            <p className="text-green-500">密码重置成功</p>
            <Link to="/login" className={btnPrimary + ' inline-block text-center'}>去登录</Link>
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to="/login" className="hover:text-brand-500 transition-colors">返回登录</Link>
        </p>
      </div>
    </div>
  )
}
