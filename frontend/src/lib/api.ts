import { tokenManager } from './tokenManager'
import type { Play } from '../types/play'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface ApiError {
  message: string
  statusCode: number
}

export interface AuthTokens {
  accessToken: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: Array<string>
  createdAt: string
}

interface LoginResponse {
  user: User
  tokens: AuthTokens
}

function getAuthHeaders(): Record<string, string> {
  const token = tokenManager.getValidAccessToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // If unauthorized, clear tokens and redirect to login
    if (response.status === 401) {
      tokenManager.clearTokens()
      window.dispatchEvent(new CustomEvent('auth:logout'))
      throw new Error('Authentication failed')
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
): Promise<T> {
  const headers = getAuthHeaders()

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  return handleResponse<T>(response)
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

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    })
    return handleResponse<LoginResponse>(response)
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
