import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const THEMES = [
  { id: 'default', name: '默认蓝', colors: 'from-blue-500 to-blue-600', free: true },
  { id: 'purple', name: '优雅紫', colors: 'from-purple-500 to-purple-600', free: false },
  { id: 'green', name: '清新绿', colors: 'from-green-500 to-green-600', free: false },
  { id: 'orange', name: '活力橙', colors: 'from-orange-500 to-orange-600', free: false },
  { id: 'pink', name: '浪漫粉', colors: 'from-pink-500 to-pink-600', free: false },
  { id: 'teal', name: '海洋青', colors: 'from-teal-500 to-teal-600', free: false },
]

export default function ThemeSettings() {
  const [isVip, setIsVip] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('default')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/vip/status').then(r => setIsVip(r.data.is_vip)).catch(() => setIsVip(false))
    const saved = localStorage.getItem('color-theme') || 'default'
    setCurrentTheme(saved)
  }, [])

  const handleThemeChange = (themeId: string, isFree: boolean) => {
    if (!isFree && !isVip) {
      alert('这是 VIP 专属主题，请先升级 VIP')
      navigate('/vip')
      return
    }

    setCurrentTheme(themeId)
    localStorage.setItem('color-theme', themeId)

    // 应用主题颜色
    const root = document.documentElement
    const theme = THEMES.find(t => t.id === themeId)
    if (theme) {
      // 这里可以根据主题设置 CSS 变量
      root.style.setProperty('--theme-primary', theme.colors)
    }

    alert('主题已切换！刷新页面后生效')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">主题设置</h1>
        {isVip && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            VIP专属主题
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {THEMES.map(theme => (
          <div
            key={theme.id}
            onClick={() => handleThemeChange(theme.id, theme.free)}
            className={`relative bg-white dark:bg-gray-800/50 p-6 rounded-xl border-2 transition-all cursor-pointer ${
              currentTheme === theme.id
                ? 'border-brand-500 shadow-lg shadow-brand-500/20'
                : 'border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700'
            }`}>
            {!theme.free && (
              <div className="absolute top-3 right-3">
                <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  VIP
                </span>
              </div>
            )}

            <div className={`w-full h-24 rounded-lg bg-gradient-to-r ${theme.colors} mb-4 flex items-center justify-center`}>
              {currentTheme === theme.id && (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>

            <h3 className="font-semibold text-center">{theme.name}</h3>
            {!theme.free && !isVip && (
              <p className="text-xs text-gray-500 text-center mt-1">需要 VIP</p>
            )}
          </div>
        ))}
      </div>

      {!isVip && (
        <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-900/50 text-center">
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">升级 VIP 解锁更多主题</h3>
          <p className="text-amber-700 dark:text-amber-300 mb-4 text-sm">
            5种专属配色方案，打造个性化学习空间
          </p>
          <button
            onClick={() => navigate('/vip')}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all text-sm font-medium">
            立即升级 VIP
          </button>
        </div>
      )}
    </div>
  )
}
