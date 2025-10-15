export type Theme = 'light' | 'dark' | 'system'

export interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  systemTheme: 'light' | 'dark'
}

export interface ThemeConfig {
  light: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
  }
  dark: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
  }
}
