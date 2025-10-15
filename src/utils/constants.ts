export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  COINS: {
    TOP: '/coins/top',
    BY_ID: '/coins/:id',
    PRICE_HISTORY: '/coins/:id/price-history',
    MARKET_DATA: '/coins/market-data',
    SEARCH: '/coins/search',
    TRENDING: '/coins/trending',
    GAINERS_LOSERS: '/coins/gainers-losers',
    WATCHLIST: '/coins/watchlist',
    PORTFOLIO: '/coins/portfolio',
  },
  CHAT: {
    MESSAGE: '/chat/message',
    SESSIONS: '/chat/sessions',
    SESSION_BY_ID: '/chat/sessions/:id',
    SUGGESTIONS: '/chat/suggestions',
    POPULAR_QUERIES: '/chat/popular-queries',
  },
  NEWS: {
    LIST: '/news',
    BY_COIN: '/news/coin/:id',
  },
} as const

export const CHART_TIME_RANGES = [
  { value: '1d', label: '1 Day' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' },
  { value: 'max', label: 'Max' },
] as const

export const CHART_COLORS = {
  primary: '#0ea5e9',
  success: '#00d4aa',
  danger: '#ff6b6b',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1',
} as const

export const CRYPTO_SYMBOLS = {
  BTC: '₿',
  ETH: 'Ξ',
  BNB: 'BNB',
  ADA: '₳',
  SOL: '◎',
  XRP: 'XRP',
  DOT: '●',
  DOGE: 'Ð',
  AVAX: 'AVAX',
  SHIB: 'SHIB',
} as const

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  USER_PREFERENCES: 'userPreferences',
  WATCHLIST: 'watchlist',
  PORTFOLIO: 'portfolio',
} as const

export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'],
    PROFILE: ['auth', 'profile'],
  },
  CRYPTO: {
    TOP_COINS: ['crypto', 'top-coins'],
    COIN_BY_ID: (id: string) => ['crypto', 'coin', id],
    PRICE_HISTORY: (id: string, range: string) => ['crypto', 'price-history', id, range],
    MARKET_DATA: ['crypto', 'market-data'],
    SEARCH: (query: string) => ['crypto', 'search', query],
    TRENDING: ['crypto', 'trending'],
    GAINERS_LOSERS: ['crypto', 'gainers-losers'],
    WATCHLIST: ['crypto', 'watchlist'],
    PORTFOLIO: ['crypto', 'portfolio'],
  },
  CHAT: {
    SESSIONS: ['chat', 'sessions'],
    SESSION_BY_ID: (id: string) => ['chat', 'session', id],
    SUGGESTIONS: ['chat', 'suggestions'],
    POPULAR_QUERIES: ['chat', 'popular-queries'],
  },
  NEWS: {
    LIST: ['news', 'list'],
    BY_COIN: (coinId: string) => ['news', 'coin', coinId],
  },
} as const

export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const
