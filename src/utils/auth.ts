// Authentication utility functions

export const clearAuthData = () => {
  // Clear localStorage
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('theme')
  
  // Clear any other auth-related data
  sessionStorage.clear()
  
  // Force reload to reset app state
  window.location.href = '/login'
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (error) {
    return true // If we can't parse the token, consider it expired
  }
}

export const getTokenExpiration = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return new Date(payload.exp * 1000)
  } catch (error) {
    return null
  }
}
