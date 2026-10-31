// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { verifyAuth, setAuthToken, clearAuthToken, getAuthToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const res = await verifyAuth()
      if (res.success) {
        setAdmin(res.admin)
      } else {
        clearAuthToken()
        setAdmin(null)
      }
    } catch {
      clearAuthToken()
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (username, password) => {
    const res = await verifyAuth()
    if (res.success) {
      return { success: true }
    }
    const loginRes = await (await import('../services/api')).adminLogin({ username, password })
    if (loginRes.success) {
      setAuthToken(loginRes.token)
      setAdmin(loginRes.admin)
      return { success: true }
    }
    return { success: false, message: loginRes.message }
  }

  const logout = () => {
    clearAuthToken()
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}