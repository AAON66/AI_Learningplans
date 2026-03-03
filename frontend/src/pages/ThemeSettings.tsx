import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const THEMES = [
  {
    id: 'default',
    name: '默认蓝',
    colors: 'from-blue-500 to-blue-600',
    free: true,
    style: 'modern',
    description: '简洁现代，专注学习',
    preview: { bg: 'bg-blue-50 dark:bg-blue-900/20', accent: 'bg-blue-500' }
  },
  {
    id: 'purple',
    name: '优雅紫',
    colors: 'from-purple-500 to-purple-600',
    free: false,
    style: 'elegant',
    description: '优雅高贵，提升品味',
    preview: { bg: 'bg-purple-50 dark:bg-purple-900/20', accent: 'bg-purple-500' }
  },
  {
    id: 'green',
    name: '清新绿',
    colors: 'from-green-500 to-green-600',
    free: false,
    style: 'fresh',
    description: '自然清新，护眼舒适',
    preview: { bg: 'bg-green-50 dark:bg-green-900/20', accent: 'bg-green-500' }
  },
  {
    id: 'orange',
    name: '活力橙',
    colors: 'from-orange-500 to-orange-600',
    free: false,
    style: 'energetic',
    description: '充满活力，激发动力',
    preview: { bg: 'bg-orange-50 dark:bg-orange-900/20', accent: 'bg-orange-500' }
  },
  {
    id: 'pink',
    name: '浪漫粉',
    colors: 'from-pink-500 to-pink-600',
    free: false,
    style: 'romantic',
    description: '温柔浪漫，愉悦心情',
    preview: { bg: 'bg-pink-50 dark:bg-pink-900/20', accent: 'bg-pink-500' }
  },
  {
    id: 'teal',
    name: '海洋青',
    colors: 'from-teal-500 to-teal-600',
    free: false,
    style: 'calm',
    description: '沉稳冷静，专注思考',
    preview: { bg: 'bg-teal-50 dark:bg-teal-900/20', accent: 'bg-teal-500' }
  },
]

const LAYOUTS = [
  {
    id: 'compact',
    name: '紧凑布局',
    description: '信息密集，适合小屏幕',
    icon: '📱',
    free: true
  },
  {
    id: 'comfortable',
    name: '舒适布局',
    description: '间距适中，平衡美观',
    icon: '💻',
    free: true
  },
  {
    id: 'spacious',
    name: '宽松布局',
    description: '留白充足，视觉舒适',
    icon: '🖥️',
    free: false
  },
]

export default function ThemeSettings() {
  const [isVip, setIsVip] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('default')
  const [currentLayout, setCurrentLayout] = useState('comfortable')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/vip/status').then(r => setIsVip(r.data.is_vip)).catch(() => setIsVip(false))
    const savedTheme = localStorage.getItem('color-theme') || 'default'
    const savedLayout = localStorage.getItem('layout-style') || 'comfortable'
    setCurrentTheme(savedTheme)
    setCurrentLayout(savedLayout)
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

  const handleLayoutChange = (layoutId: string, isFree: boolean) => {
    if (!isFree && !isVip) {
      alert('这是 VIP 专属布局，请先升级 VIP')
      navigate('/vip')
      return
    }

    setCurrentLayout(layoutId)
    localStorage.setItem('layout-style', layoutId)

    // 应用布局样式
    const root = document.documentElement
    root.setAttribute('data-layout', layoutId)

    alert('布局已切换！刷新页面后生效')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1">主题与布局设置</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">个性化你的学习空间</p>
        </div>
        {isVip && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            VIP专属功能
          </span>
        )}
      </div>

      {/* 主题颜色选择 */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🎨</span>
          主题颜色
        </h2>
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map(theme => (
            <div
              key={theme.id}
              onClick={() => handleThemeChange(theme.id, theme.free)}
              className={`relative bg-white dark:bg-gray-800/50 rounded-xl border-2 transition-all cursor-pointer overflow-hidden group ${
                currentTheme === theme.id
                  ? 'border-brand-500 shadow-lg shadow-brand-500/20'
                  : 'border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md'
              }`}>
              {!theme.free && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md flex items-center gap-0.5 shadow-sm">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    VIP
                  </span>
                </div>
              )}

              {/* 主题预览区域 */}
              <div className={`relative h-32 bg-gradient-to-r ${theme.colors} p-4 flex items-center justify-center`}>
                {currentTheme === theme.id && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-3">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-500">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </div>
                )}
                <div className="text-white text-center">
                  <div className="text-sm font-medium opacity-90 mb-1">示例卡片</div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-xs">
                    学习计划
                  </div>
                </div>
              </div>

              {/* 主题信息 */}
              <div className="p-4">
                <h3 className="font-semibold text-base mb-1">{theme.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{theme.description}</p>
                {!theme.free && !isVip && (
                  <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    需要 VIP 解锁
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 布局样式选择 */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">📐</span>
          布局样式
        </h2>
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {LAYOUTS.map(layout => (
            <div
              key={layout.id}
              onClick={() => handleLayoutChange(layout.id, layout.free)}
              className={`relative bg-white dark:bg-gray-800/50 p-6 rounded-xl border-2 transition-all cursor-pointer ${
                currentLayout === layout.id
                  ? 'border-brand-500 shadow-lg shadow-brand-500/20'
                  : 'border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700'
              }`}>
              {!layout.free && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    VIP
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <span className="text-4xl">{layout.icon}</span>
              </div>

              {/* 布局预览 */}
              <div className="mb-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                {layout.id === 'compact' && (
                  <div className="space-y-1">
                    <div className="h-2 bg-brand-200 dark:bg-brand-800 rounded"></div>
                    <div className="h-2 bg-brand-200 dark:bg-brand-800 rounded w-3/4"></div>
                    <div className="h-2 bg-brand-200 dark:bg-brand-800 rounded w-1/2"></div>
                  </div>
                )}
                {layout.id === 'comfortable' && (
                  <div className="space-y-2">
                    <div className="h-2 bg-brand-200 dark:bg-brand-800 rounded"></div>
                    <div className="h-2 bg-brand-200 dark:bg-brand-800 rounded w-3/4"></div>
                    <div className="h-2 bg-brand-200 dark:bg-brand-800 rounded w-1/2"></div>
                  </div>
                )}
                {layout.id === 'spacious' && (
                  <div className="space-y-3">
                    <div className="h-2 bg-brand-200 dark:bg-brand-800 rounded"></div>
                    <div className="h-2 bg-brand-200 dark:bg-brand-800 rounded w-3/4"></div>
                    <div className="h-2 bg-brand-200 dark:bg-brand-800 rounded w-1/2"></div>
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-center mb-1">{layout.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{layout.description}</p>

              {currentLayout === layout.id && (
                <div className="mt-3 text-center">
                  <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded flex items-center justify-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    当前使用
                  </span>
                </div>
              )}

              {!layout.free && !isVip && (
                <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 text-center flex items-center justify-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  需要 VIP
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!isVip && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-5 sm:p-8 rounded-xl border border-amber-200 dark:border-amber-900/50">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl sm:text-3xl">
                ⭐
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-amber-900 dark:text-amber-100 mb-2">升级 VIP 解锁全部主题与布局</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  5种专属配色方案
                </div>
                <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  宽松布局样式
                </div>
                <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  个性化学习空间
                </div>
                <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  更多功能持续更新
                </div>
              </div>
              <button
                onClick={() => navigate('/vip')}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all text-sm font-medium inline-flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                立即升级 VIP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
