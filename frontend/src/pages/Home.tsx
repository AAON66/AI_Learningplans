import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center py-20">
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
          {isAuthenticated ? (
            <>
              <Link to="/plans/create" className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-8 py-3 rounded-lg hover:shadow-xl hover:shadow-brand-500/25 transition-all text-sm font-medium">
                开始创建计划
              </Link>
              <Link to="/plans" className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium">
                查看我的计划
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-8 py-3 rounded-lg hover:shadow-xl hover:shadow-brand-500/25 transition-all text-sm font-medium">
                免费注册
              </Link>
              <Link to="/login" className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium">
                立即登录
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {[
          { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: '智能分析', desc: 'AI 深度分析学习需求' },
          { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', title: '科学规划', desc: '自动生成阶段化计划' },
          { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', title: '进度追踪', desc: '可视化学习数据统计' },
        ].map(f => (
          <div key={f.title} className="text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-4 mx-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-500"><path d={f.icon} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-base font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* VIP Section */}
      <div className="mt-24 mb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-600 dark:text-amber-400 text-sm mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            VIP 专属权益
          </div>
          <h2 className="text-3xl font-bold mb-3">解锁全部 AI 功能</h2>
          <p className="text-gray-500 dark:text-gray-400">升级 VIP 会员，享受完整的智能学习体验</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: '🤖',
              title: 'AI 需求分析',
              desc: '使用 DeepSeek R1 深度分析学习需求，生成专业评估报告',
              badge: 'VIP',
              free: '每天3次'
            },
            {
              icon: '📊',
              title: '无限学习计划',
              desc: '创建无限个学习计划，管理多个学习目标',
              badge: 'VIP',
              free: '最多3个'
            },
            {
              icon: '📚',
              title: 'AI 资源推荐',
              desc: '智能推荐优质学习资源，包括视频、文章、书籍、课程',
              badge: 'VIP',
              free: '有限'
            },
            {
              icon: '💡',
              title: '学习方法建议',
              desc: '根据个人情况定制学习方法，提供专业学习技巧指导',
              badge: 'VIP',
              free: '基础'
            },
            {
              icon: '📈',
              title: '高级统计分析',
              desc: '详细图表、趋势分析、学习报告，全面了解学习进度',
              badge: 'VIP',
              free: '基础统计'
            },
            {
              icon: '📥',
              title: '数据导出',
              desc: '导出学习数据为PDF/Excel，方便分享和存档',
              badge: 'VIP',
              free: '不可用'
            },
            {
              icon: '🎨',
              title: '自定义主题',
              desc: '多种主题颜色选择，打造个性化学习环境',
              badge: 'VIP',
              free: '默认主题'
            },
            {
              icon: '🏆',
              title: 'VIP 专属徽章',
              desc: '显示VIP身份标识，享受优先支持和专属服务',
              badge: 'VIP',
              free: '无'
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{feature.icon}</span>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  {feature.badge}
                </span>
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition-colors">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-2">{feature.desc}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">免费版: {feature.free}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to={isAuthenticated ? "/vip" : "/register"}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-lg hover:shadow-xl hover:shadow-amber-500/25 transition-all text-sm font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {isAuthenticated ? '立即升级 VIP' : '注册并升级 VIP'}
          </Link>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">支持 7天/30天/90天/180天/365天 多种时长选择</p>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="mt-24 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">开始你的智能学习之旅</h2>
          <p className="text-white/90 mb-8 max-w-lg mx-auto">
            立即注册，免费体验基础功能。升级 VIP 解锁全部 AI 智能特性。
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-brand-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
              免费注册
            </Link>
            <Link to="/login" className="border-2 border-white/30 text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-all text-sm font-medium">
              已有账号？登录
            </Link>
          </div>
        </div>
      )}

      {/* Footer Links */}
      <footer className="mt-24 pt-12 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 学习资源 */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">优质学习资源</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  Coursera - 在线课程平台
                </a>
              </li>
              <li>
                <a href="https://www.edx.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  edX - 名校公开课
                </a>
              </li>
              <li>
                <a href="https://www.udemy.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  Udemy - 技能学习
                </a>
              </li>
              <li>
                <a href="https://www.khanacademy.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  Khan Academy - 免费教育
                </a>
              </li>
            </ul>
          </div>

          {/* 开发者资源 */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">开发者学习</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  GitHub - 代码托管
                </a>
              </li>
              <li>
                <a href="https://stackoverflow.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  Stack Overflow - 技术问答
                </a>
              </li>
              <li>
                <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  MDN - Web 开发文档
                </a>
              </li>
              <li>
                <a href="https://www.freecodecamp.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  freeCodeCamp - 编程学习
                </a>
              </li>
            </ul>
          </div>

          {/* 中文学习平台 */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">中文学习平台</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.icourse163.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  中国大学MOOC - 慕课
                </a>
              </li>
              <li>
                <a href="https://www.xuetangx.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  学堂在线 - 清华慕课
                </a>
              </li>
              <li>
                <a href="https://www.bilibili.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  哔哩哔哩 - 学习视频
                </a>
              </li>
              <li>
                <a href="https://juejin.cn" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                  掘金 - 技术社区
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 智学计划. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/admin/login" className="text-gray-400 hover:text-purple-500 transition-colors flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              管理员入口
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-500 transition-colors">
              关于我们
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-500 transition-colors">
              联系我们
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
