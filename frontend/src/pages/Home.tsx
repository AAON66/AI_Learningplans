import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center py-28">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-sm mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        AI 驱动的智能学习
      </div>
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight">
        让学习更<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">高效</span>
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-lg mx-auto leading-relaxed">
        基于 AI 的个性化学习规划工具，智能分析需求、定制计划、推荐资源，助你科学高效地达成学习目标。
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/plans/create" className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-8 py-3 rounded-lg hover:shadow-xl hover:shadow-brand-500/25 transition-all text-sm font-medium">
          开始创建计划
        </Link>
        <Link to="/plans" className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium">
          查看我的计划
        </Link>
      </div>
      <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-left">
        {[
          { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: '智能分析', desc: 'AI 深度分析学习需求' },
          { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', title: '科学规划', desc: '自动生成阶段化计划' },
          { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', title: '进度追踪', desc: '可视化学习数据统计' },
        ].map(f => (
          <div key={f.title}>
            <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-500"><path d={f.icon} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
