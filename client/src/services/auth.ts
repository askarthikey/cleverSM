import api from './api'

export interface User {
  _id: string
  username: string
  email?: string
  phone?: string
  profilePicture?: string
  bio?: string
  isVerified: boolean
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface BackendAuthResponse {
  statusCode: number
  message: string
  data: AuthResponse
}

export interface RegisterRequest {
  username: string
  email?: string
  phone?: string
  password: string
}

export interface LoginRequest {
  identifier: string // username, email, or phone
  password: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponse {
  success: boolean
}

export interface BackendChangePasswordResponse {
  statusCode: number
  message: string
  data: ChangePasswordResponse
}

export interface UsernameCheckResponse {
  available: boolean
}

export interface BackendUsernameCheckResponse {
  statusCode: number
  message: string
  data: UsernameCheckResponse
}

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<BackendAuthResponse>('/auth/register', data)
    
    // Store tokens in localStorage
    if (response.data.data.accessToken) {
      localStorage.setItem('auth_token', response.data.data.accessToken)
      localStorage.setItem('refresh_token', response.data.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    
    return response.data.data
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<BackendAuthResponse>('/auth/login', data)
    
    // Store tokens in localStorage
    if (response.data.data.accessToken) {
      localStorage.setItem('auth_token', response.data.data.accessToken)
      localStorage.setItem('refresh_token', response.data.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    
    return response.data.data
  }

  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    console.log('🔐 Attempting to change password...')
    const response = await api.post<BackendChangePasswordResponse>('/auth/change-password', data)
    console.log('✅ Password change response:', response.data)
    return response.data.data
  }

  async checkUsername(username: string): Promise<UsernameCheckResponse> {
    const response = await api.get<BackendUsernameCheckResponse>(`/auth/check-username/${username}`)
    return response.data.data
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) return null

      const response = await api.post('/auth/refresh', { refreshToken })
      const newAccessToken = response.data.data.accessToken

      localStorage.setItem('auth_token', newAccessToken)
      return newAccessToken
    } catch (error) {
      // Refresh failed, logout user
      this.logout()
      return null
    }
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()