import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import MouseParticles from './components/effects/MouseParticles'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Plans from './pages/Plans'
import CreatePlan from './pages/CreatePlan'
import PlanDetail from './pages/PlanDetail'
import Progress from './pages/Progress'
import StatsEnhanced from './pages/StatsEnhanced'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import ForgotPassword from './pages/ForgotPassword'
import VIP from './pages/VIP'
import Dashboard from './pages/Dashboard'
import AdminVIP from './pages/AdminVIP'
import AdminLogin from './pages/AdminLogin'
import ThemeSettings from './pages/ThemeSettings'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const theme = useTheme()
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <MouseParticles />
      <Header theme={theme} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
          <Route path="/plans/create" element={<ProtectedRoute><CreatePlan /></ProtectedRoute>} />
          <Route path="/plans/:id" element={<ProtectedRoute><PlanDetail /></ProtectedRoute>} />
          <Route path="/plans/:id/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/plans/:id/stats" element={<ProtectedRoute><StatsEnhanced /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/vip" element={<ProtectedRoute><VIP /></ProtectedRoute>} />
          <Route path="/theme-settings" element={<ProtectedRoute><ThemeSettings /></ProtectedRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/vip" element={<AdminVIP />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
