const STEPS = ['draft', 'analysis', 'planning', 'content', 'method', 'active', 'completed']
const LABELS: Record<string, string> = {
  draft: '草稿', analysis: '需求分析', planning: '阶段规划',
  content: '资源推荐', method: '方式制定', active: '学习中', completed: '已完成'
}

export default function StatusIndicator({ status }: { status: string }) {
  const idx = STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-3">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all
            ${i < idx
              ? 'bg-brand-500 text-white'
              : i === idx
                ? 'bg-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-900/40'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
            {i < idx ? '✓' : i + 1}
          </div>
          <span className={`text-xs mx-1.5 whitespace-nowrap ${i === idx ? 'text-brand-600 dark:text-brand-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
            {LABELS[s]}
          </span>
          {i < STEPS.length - 1 && <div className={`w-6 h-0.5 ${i < idx ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
        </div>
      ))}
    </div>
  )
}
