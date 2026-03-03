import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Plans from './pages/Plans'
import CreatePlan from './pages/CreatePlan'
import PlanDetail from './pages/PlanDetail'
import Progress from './pages/Progress'
import Stats from './pages/Stats'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const theme = useTheme()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header theme={theme} />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
          <Route path="/plans/create" element={<ProtectedRoute><CreatePlan /></ProtectedRoute>} />
          <Route path="/plans/:id" element={<ProtectedRoute><PlanDetail /></ProtectedRoute>} />
          <Route path="/plans/:id/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/plans/:id/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
