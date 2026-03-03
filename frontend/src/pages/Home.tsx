import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [showDemo, setShowDemo] = useState<string | null>(null)

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center py-12 sm:py-16 md:py-20 px-4">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xs sm:text-sm mb-6 sm:mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-4 sm:h-4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          AI 驱动的智能学习
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5 tracking-tight px-4">
          让学习更<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">高效</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 sm:mb-12 max-w-lg mx-auto leading-relaxed px-4">
          基于 AI 的个性化学习规划工具，智能分析需求、定制计划、推荐资源，助你科学高效地达成学习目标。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          {isAuthenticated ? (
            <>
              <Link to="/plans/create" className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:shadow-xl hover:shadow-brand-500/25 transition-all text-sm font-medium">
                开始创建计划
              </Link>
              <Link to="/plans" className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium">
                查看我的计划
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:shadow-xl hover:shadow-brand-500/25 transition-all text-sm font-medium">
                免费注册
              </Link>
              <Link to="/login" className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium">
                立即登录
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
        {[
          {
            icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
            title: '智能分析',
            desc: 'AI 深度分析学习需求',
            demoKey: 'analysis'
          },
          {
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
            title: '科学规划',
            desc: '自动生成阶段化计划',
            demoKey: 'planning'
          },
          {
            icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
            title: '进度追踪',
            desc: '可视化学习数据统计',
            demoKey: 'tracking'
          },
        ].map(f => (
          <button
            key={f.title}
            onClick={() => setShowDemo(f.demoKey)}
            className="text-center p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-gray-800/50 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-500 sm:w-6 sm:h-6"><path d={f.icon} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 group-hover:text-brand-500 transition-colors">{f.title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">{f.desc}</p>
            <span className="text-xs text-brand-500 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">点击查看示例 →</span>
          </button>
        ))}
      </div>

      {/* VIP Section */}
      <div className="mt-16 sm:mt-20 md:mt-24 mb-8 sm:mb-12 px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-600 dark:text-amber-400 text-xs sm:text-sm mb-3 sm:mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="sm:w-4 sm:h-4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            VIP 专属权益
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">解锁全部 AI 功能</h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">升级 VIP 会员，享受完整的智能学习体验</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
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

      {/* Demo Modals */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDemo(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            {showDemo === 'analysis' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    智能分析示例
                  </h3>
                  <button onClick={() => setShowDemo(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-lg">
                    <p className="text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">用户输入：</p>
                    <p className="text-gray-700 dark:text-gray-300">"我想学习 Python 编程，目前是零基础，希望能在3个月内掌握基础知识并能做简单项目"</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">AI 分析结果：</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">学习目标明确</p>
                          <p className="text-gray-600 dark:text-gray-400">掌握 Python 基础并能完成简单项目</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">时间规划合理</p>
                          <p className="text-gray-600 dark:text-gray-400">3个月时间对于零基础学习 Python 基础是合理的</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">!</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">建议补充信息</p>
                          <p className="text-gray-600 dark:text-gray-400">每天可投入的学习时间、是否有编程基础、学习目的（工作/兴趣）</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-brand-500 mt-0.5">→</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">推荐难度等级</p>
                          <p className="text-gray-600 dark:text-gray-400">初级（Beginner）- 适合零基础学习者</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showDemo === 'planning' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    科学规划示例
                  </h3>
                  <button onClick={() => setShowDemo(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">基于 AI 分析结果，系统自动生成阶段化学习计划：</p>
                  <div className="space-y-3">
                    {[
                      { stage: '第一阶段', title: 'Python 基础语法', duration: '3周', topics: ['变量与数据类型', '控制流程', '函数基础', '文件操作'] },
                      { stage: '第二阶段', title: '面向对象编程', duration: '3周', topics: ['类与对象', '继承与多态', '模块与包', '异常处理'] },
                      { stage: '第三阶段', title: '实战项目练习', duration: '3周', topics: ['Web 爬虫项目', '数据分析入门', '简单 Web 应用', '项目总结'] },
                      { stage: '第四阶段', title: '进阶与巩固', duration: '3周', topics: ['常用库学习', '代码优化', '项目实战', '知识复习'] },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border-l-4 border-brand-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-900/30 px-2 py-1 rounded">{item.stage}</span>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h4>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{item.duration}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.topics.map((topic, j) => (
                            <span key={j} className="text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {showDemo === 'tracking' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-500">
                      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    进度追踪示例
                  </h3>
                  <button onClick={() => setShowDemo(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">实时追踪学习进度，可视化展示学习数据：</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: '总学习时长', value: '42h 30m', icon: '📚', color: 'from-brand-500 to-brand-600' },
                      { label: '打卡天数', value: '28天', icon: '✅', color: 'from-green-500 to-emerald-600' },
                      { label: '连续天数', value: '7天', icon: '🔥', color: 'from-amber-500 to-orange-600' },
                      { label: '完成度', value: '65%', icon: '🎯', color: 'from-violet-500 to-purple-600' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-center">
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                        <p className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">学习趋势图表（VIP专属）</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-16">周一</span>
                        <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600" style={{width: '80%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-12">2.5h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-16">周二</span>
                        <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-12">1.8h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-16">周三</span>
                        <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600" style={{width: '90%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-12">3.0h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-16">周四</span>
                        <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600" style={{width: '70%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-12">2.2h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
