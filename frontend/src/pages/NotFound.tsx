import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-28">
      <h1 className="text-7xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</h1>
      <p className="text-gray-400 dark:text-gray-500 mb-6">页面不存在</p>
      <Link to="/" className="text-brand-500 hover:text-brand-600 text-sm transition-colors">返回首页 &rarr;</Link>
    </div>
  )
}
