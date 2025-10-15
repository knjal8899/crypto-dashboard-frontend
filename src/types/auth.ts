export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface AuthResponse {
  access: string
  refresh: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface TokenRefreshResponse {
  accessToken: string
  refreshToken: string
}
