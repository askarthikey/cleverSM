import { apiService } from '../api/index'
import type { ApiResponse } from '../api/index'

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
  token: string
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

export interface UsernameCheckResponse {
  available: boolean
}

class AuthService {
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/register', data)
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/login', data)
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response
  }

  async checkUsername(username: string): Promise<ApiResponse<UsernameCheckResponse>> {
    return await apiService.get<ApiResponse<UsernameCheckResponse>>(`/auth/check-username/${username}`)
  }

  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
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

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()