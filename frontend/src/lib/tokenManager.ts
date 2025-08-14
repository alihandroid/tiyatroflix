interface AuthTokens {
  accessToken: string
  refreshToken: string
}

class TokenManager {
  private refreshPromise: Promise<AuthTokens> | null = null

  constructor() {}

  getAccessToken(): string | null {
    return localStorage.getItem('access-token')
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh-token')
  }

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem('access-token', tokens.accessToken)
    localStorage.setItem('refresh-token', tokens.refreshToken)
  }

  clearTokens(): void {
    localStorage.removeItem('access-token')
    localStorage.removeItem('refresh-token')
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch {
      return true
    }
  }

  async refreshTokens(): Promise<AuthTokens | null> {
    // If a refresh is already in progress, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    const refreshToken = this.getRefreshToken()
    const accessToken = this.getAccessToken()

    if (!refreshToken || !accessToken) {
      return null
    }

    this.refreshPromise = this.performTokenRefresh(accessToken, refreshToken)

    try {
      const newTokens = await this.refreshPromise
      this.setTokens(newTokens)
      return newTokens
    } catch (error) {
      this.clearTokens()
      throw error
    } finally {
      this.refreshPromise = null
    }
  }

  private async performTokenRefresh(
    accessToken: string,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken, refreshToken }),
      },
    )

    if (!response.ok) {
      throw new Error('Token refresh failed')
    }

    return response.json()
  }

  async getValidAccessToken(): Promise<string | null> {
    const accessToken = this.getAccessToken()

    if (!accessToken) {
      return null
    }

    // If token is not expired, return it
    if (!this.isTokenExpired(accessToken)) {
      return accessToken
    }

    // Try to refresh the token
    try {
      const newTokens = await this.refreshTokens()
      return newTokens?.accessToken || null
    } catch {
      return null
    }
  }
}

export const tokenManager = new TokenManager()
