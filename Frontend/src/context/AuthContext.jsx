/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try { setUser(await authApi.me()) } catch { setUser(null) } finally { setLoading(false) }
  }
  useEffect(() => {
    let active = true
    authApi.me().then((account) => { if (active) setUser(account) }).catch(() => { if (active) setUser(null) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const login = async (phone, password) => { await authApi.login(phone, password); await refreshUser() }
  const register = (data) => authApi.register(data)
  const logout = async () => { await authApi.logout(); setUser(null) }
  const value = { user, loading, login, register, logout, refreshUser }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
