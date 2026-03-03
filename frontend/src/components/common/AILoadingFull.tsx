interface AILoadingFullProps {
  text?: string
  subtext?: string
}

export default function AILoadingFull({ text = 'AI 正在思考', subtext }: AILoadingFullProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* 脉动的 AI 大脑图标 */}
      <div className="relative mb-6">
        {/* 外圈脉动光环 */}
        <div className="absolute inset-0 -m-4">
          <div className="w-24 h-24 rounded-full bg-brand-500/20 animate-ping"></div>
        </div>
        <div className="absolute inset-0 -m-2">
          <div className="w-20 h-20 rounded-full bg-brand-500/30 animate-pulse"></div>
        </div>

        {/* 中心旋转圆环 */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 animate-spin-slow" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="60 200"
            />
          </svg>

          {/* AI 图标 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* 加载文字 */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {text}
          <span className="inline-flex ml-1">
            <span className="animate-bounce-dot" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce-dot" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce-dot" style={{ animationDelay: '300ms' }}>.</span>
          </span>
        </h3>
        {subtext && (
          <p className="text-sm text-gray-600 dark:text-gray-300 animate-pulse">
            {subtext}
          </p>
        )}
      </div>

      {/* 进度条动画 */}
      <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-6">
        <div className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full animate-progress"></div>
      </div>
    </div>
  )
}
