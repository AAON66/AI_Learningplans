interface AILoadingSpinnerProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'button'
}

export default function AILoadingSpinner({ text = 'AI 思考中', size = 'md', variant = 'default' }: AILoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const textColorClasses = {
    default: 'text-gray-700 dark:text-gray-300',
    button: 'text-white'
  }

  const spinnerColorClasses = {
    default: 'border-t-brand-500 border-r-brand-400',
    button: 'border-t-white border-r-white/70'
  }

  return (
    <div className="inline-flex items-center gap-2">
      {/* 旋转的渐变圆环 */}
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-2 ${variant === 'button' ? 'border-white/30' : 'border-gray-200 dark:border-gray-700'}`}></div>
        <div className={`${sizeClasses[size]} absolute inset-0 rounded-full border-2 border-transparent ${spinnerColorClasses[variant]} animate-spin`}></div>
      </div>

      {/* 跳动的文字 */}
      <span className={`${textSizeClasses[size]} font-medium ${textColorClasses[variant]}`}>
        {text}
        <span className="inline-flex ml-0.5">
          <span className="animate-bounce-dot" style={{ animationDelay: '0ms' }}>.</span>
          <span className="animate-bounce-dot" style={{ animationDelay: '150ms' }}>.</span>
          <span className="animate-bounce-dot" style={{ animationDelay: '300ms' }}>.</span>
        </span>
      </span>
    </div>
  )
}
