import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import SliderCaptcha from '../components/auth/SliderCaptcha'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [failCount, setFailCount] = useState(0)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (failCount >= 3 && !captchaVerified) {
      setError('请完成滑块验证')
      return
    }
    try {
      await login(email, password)
      nav('/plans')
    } catch {
      setFailCount(prev => prev + 1)
      setError('登录失败，请检查邮箱和密码')
      setCaptchaVerified(false)
    }
  }

  const inputCls = "w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder:text-gray-400"

  return (
    <div className="max-w-sm mx-auto mt-24">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <h2 className="text-2xl font-bold">欢迎回来</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">登录你的学习账号</p>
      </div>
      {error && <p className="text-red-500 text-xs mb-4 text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="邮箱地址" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} required />
        <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} className={inputCls} required />
        {failCount >= 3 && <SliderCaptcha onSuccess={() => setCaptchaVerified(true)} />}
        <button type="submit" className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white py-2.5 rounded-lg hover:shadow-lg hover:shadow-brand-500/25 transition-all text-sm font-medium">登录</button>
      </form>
      <p className="text-center mt-6 text-sm text-gray-400">
        没有账号？<Link to="/register" className="text-brand-500 hover:text-brand-600 transition-colors">立即注册</Link>
        <span className="mx-2">·</span>
        <Link to="/forgot-password" className="text-brand-500 hover:text-brand-600 transition-colors">忘记密码？</Link>
      </p>
    </div>
  )
}
