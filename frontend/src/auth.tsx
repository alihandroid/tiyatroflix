import React, { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from './lib/api'
import { tokenManager } from './lib/tokenManager'
import type { User } from './lib/api'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Restore auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getValidAccessToken()
      if (token) {
        try {
          const userData = await authApi.validateToken(token)
          if (userData.valid) {
            setUser(userData.user)
            setIsAuthenticated(true)
          } else {
            tokenManager.clearTokens()
          }
        } catch {
          tokenManager.clearTokens()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      setUser(null)
      setIsAuthenticated(false)
      tokenManager.clearTokens()
    }

    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  const login = async (email: string, password: string) => {
    try {
      const { user: userData, tokens } = await authApi.login(email, password)
      setUser(userData)
      setIsAuthenticated(true)
      tokenManager.setTokens(tokens)
    } catch (error) {
      throw new Error('Authentication failed')
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    tokenManager.clearTokens()
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
