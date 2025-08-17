interface AuthTokens {
  accessToken: string
}

class TokenManager {
  constructor() {}

  getAccessToken(): string | null {
    return localStorage.getItem('access-token')
  }

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem('access-token', tokens.accessToken)
  }

  clearTokens(): void {
    localStorage.removeItem('access-token')
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

  getValidAccessToken(): string | null {
    const accessToken = this.getAccessToken()

    if (!accessToken) {
      return null
    }

    // If token is expired, clear it and return null
    if (this.isTokenExpired(accessToken)) {
      this.clearTokens()
      return null
    }

    return accessToken
  }
}

export const tokenManager = new TokenManager()
