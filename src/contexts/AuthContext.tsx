import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { AuthState, User, LoginRequest, RegisterRequest } from '@/types'
import { authService } from '@/services/authService'
import apiClient from '@/lib/axios'

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKENS'; payload: { accessToken: string; refreshToken: string } }
  | { type: 'CLEAR_AUTH' }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_TOKENS':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
      }
    case 'CLEAR_AUTH':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)


  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        if (accessToken && refreshToken) {
          apiClient.setTokens(accessToken, refreshToken)
          const user = await authService.getCurrentUser()
          dispatch({ type: 'SET_USER', payload: user })
          dispatch({ type: 'SET_TOKENS', payload: { accessToken, refreshToken } })
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        apiClient.clearTokens()
        dispatch({ type: 'CLEAR_AUTH' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await authService.login(credentials)
      
      // Set tokens first
      apiClient.setTokens(response.access, response.refresh)
      
      // Get user info after successful login
      const user = await authService.getCurrentUser()
      
      dispatch({ type: 'SET_USER', payload: user })
      dispatch({ type: 'SET_TOKENS', payload: { 
        accessToken: response.access, 
        refreshToken: response.refresh 
      }})
    } catch (error) {
      console.error('Login error:', error)
      dispatch({ type: 'CLEAR_AUTH' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const register = async (userData: RegisterRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authService.register(userData)
      
      // Set tokens first
      apiClient.setTokens(response.access, response.refresh)
      
      // Get user info after successful registration
      const user = await authService.getCurrentUser()
      
      dispatch({ type: 'SET_USER', payload: user })
      dispatch({ type: 'SET_TOKENS', payload: { 
        accessToken: response.access, 
        refreshToken: response.refresh 
      }})
    } catch (error) {
      console.error('Registration error:', error)
      dispatch({ type: 'CLEAR_AUTH' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = async () => {
    try {
      const refreshToken = state.refreshToken
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      apiClient.clearTokens()
      dispatch({ type: 'CLEAR_AUTH' })
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(userData)
      dispatch({ type: 'SET_USER', payload: updatedUser })
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
