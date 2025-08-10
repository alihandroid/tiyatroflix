import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

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
    const token = localStorage.getItem('access-token')
    if (token) {
      // Validate token with your API
      fetch(import.meta.env.VITE_API_BASE_URL + '/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((userData) => {
          if (userData.valid) {
            setUser(userData.user)
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem('access-token')
          }
        })
        .catch(() => {
          localStorage.removeItem('access-token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
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
    // Replace with your authentication logic
    const response = await fetch(
      import.meta.env.VITE_API_BASE_URL + '/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      },
    )

    if (response.ok) {
      const res = await response.json()
      const { tokens, ...userData } = res
      setUser(userData)
      setIsAuthenticated(true)
      // Store token for persistence
      localStorage.setItem('access-token', tokens.accessToken)
      localStorage.setItem('refresh-token', tokens.refreshToken)
    } else {
      throw new Error('Authentication failed')
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('access-token')
    localStorage.removeItem('refresh-token')
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
