import type { Play } from '../types/play'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface ApiError {
  message: string
  statusCode: number
}

function getAuthHeaders() {
  const token = localStorage.getItem('access-token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message || 'An error occurred')
  }
  return response.json()
}

export const playsApi = {
  getAll: async (): Promise<Array<Play>> => {
    const response = await fetch(`${API_BASE_URL}/plays`, {
      headers: getAuthHeaders(),
    })
    return handleResponse<Array<Play>>(response)
  },

  getById: async (id: number): Promise<Play> => {
    const response = await fetch(`${API_BASE_URL}/plays/${id}`, {
      headers: getAuthHeaders(),
    })
    return handleResponse<Play>(response)
  },

  create: async (play: Omit<Play, 'id'>): Promise<Play> => {
    const response = await fetch(`${API_BASE_URL}/plays`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(play),
    })
    return handleResponse<Play>(response)
  },

  update: async (id: number, play: Partial<Play>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/plays/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(play),
    })
    if (!response.ok) {
      throw new Error('Failed to update play')
    }
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/plays/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error('Failed to delete play')
    }
  },
}
