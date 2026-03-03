import { useState, useEffect, useCallback } from 'react'
import { authService } from '../services/auth'

export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      setUser({ email: localStorage.getItem('user_email') || '' })
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password)
    localStorage.setItem('access_token', res.data.access_token)
    localStorage.setItem('refresh_token', res.data.refresh_token)
    localStorage.setItem('user_email', email)
    setUser({ email })
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    await authService.register(email, password)
    await login(email, password)
  }, [login])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
  }, [])

  return { user, loading, login, register, logout, isAuthenticated: !!user }
}
