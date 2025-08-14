import { tokenManager } from './tokenManager'
import type { Play } from '../types/play'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface ApiError {
  message: string
  statusCode: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: Array<string>
}

interface LoginResponse {
  user: User
  tokens: AuthTokens
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await tokenManager.getValidAccessToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // If unauthorized, try to refresh token and retry once
    if (response.status === 401) {
      try {
        await tokenManager.refreshTokens()
        throw new Error('TOKEN_REFRESH_NEEDED')
      } catch (refreshError) {
        tokenManager.clearTokens()
        // Redirect to login or emit logout event
        window.dispatchEvent(new CustomEvent('auth:logout'))
        throw new Error('Authentication failed')
      }
    }

    const error: ApiError = await response.json().catch(() => ({
      message: 'An error occurred',
      statusCode: response.status,
    }))
    throw new Error(error.message || 'An error occurred')
  }
  // Handle 204 No Content - return undefined for void operations
  if (response.status === 204) {
    return undefined as T
  }
  return response.json()
}

async function makeAuthenticatedRequest<T>(
  url: string,
  options: RequestInit = {},
  retryCount = 0,
): Promise<T> {
  const headers = await getAuthHeaders()

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  try {
    return await handleResponse<T>(response)
  } catch (error) {
    // If token refresh is needed and we haven't retried yet
    if (
      error instanceof Error &&
      error.message === 'TOKEN_REFRESH_NEEDED' &&
      retryCount === 0
    ) {
      // Retry the request with new token
      const newHeaders = await getAuthHeaders()
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...newHeaders,
          ...options.headers,
        },
      })
      return handleResponse<T>(retryResponse)
    }
    throw error
  }
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse<LoginResponse>(response)
  },

  refreshToken: async (
    accessToken: string,
    refreshToken: string,
  ): Promise<AuthTokens> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken, refreshToken }),
    })
    return handleResponse<AuthTokens>(response)
  },

  revokeToken: async (refreshToken: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })
    if (!response.ok) {
      throw new Error('Failed to revoke token')
    }
  },

  validateToken: async (
    token: string,
  ): Promise<{ valid: boolean; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return handleResponse<{ valid: boolean; user: User }>(response)
  },
}

export const playsApi = {
  getAll: async (): Promise<Array<Play>> => {
    return makeAuthenticatedRequest<Array<Play>>(`${API_BASE_URL}/plays`)
  },

  getById: async (id: number): Promise<Play> => {
    return makeAuthenticatedRequest<Play>(`${API_BASE_URL}/plays/${id}`)
  },

  getCount: async (): Promise<{ count: number }> => {
    return makeAuthenticatedRequest<{ count: number }>(
      `${API_BASE_URL}/plays/count`,
    )
  },

  create: async (play: Omit<Play, 'id'>): Promise<Play> => {
    return makeAuthenticatedRequest<Play>(`${API_BASE_URL}/plays`, {
      method: 'POST',
      body: JSON.stringify(play),
    })
  },

  update: async (id: number, play: Partial<Play>): Promise<void> => {
    return makeAuthenticatedRequest<void>(`${API_BASE_URL}/plays/${id}`, {
      method: 'PUT',
      body: JSON.stringify(play),
    })
  },

  delete: async (id: number): Promise<void> => {
    return makeAuthenticatedRequest<void>(`${API_BASE_URL}/plays/${id}`, {
      method: 'DELETE',
    })
  },
}

export const usersApi = {
  getAll: async (): Promise<Array<User>> => {
    return makeAuthenticatedRequest<Array<User>>(`${API_BASE_URL}/users`)
  },

  getCount: async (): Promise<{ count: number }> => {
    return makeAuthenticatedRequest<{ count: number }>(
      `${API_BASE_URL}/users/count`,
    )
  },
}
