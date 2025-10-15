import apiClient from '@/lib/axios'
import { AuthResponse, LoginRequest, RegisterRequest, TokenRefreshResponse, User } from '@/types'

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials)
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', userData)
  },

  async logout(refreshToken: string): Promise<void> {
    return apiClient.post<void>('/auth/logout', { refresh: refreshToken })
  },

  async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
    return apiClient.post<TokenRefreshResponse>('/auth/refresh', { refresh: refreshToken })
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me')
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    return apiClient.put<User>('/auth/profile', userData)
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiClient.post<void>('/auth/change-password', {
      currentPassword,
      newPassword,
    })
  },

  async forgotPassword(email: string): Promise<void> {
    return apiClient.post<void>('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return apiClient.post<void>('/auth/reset-password', {
      token,
      newPassword,
    })
  },
}
