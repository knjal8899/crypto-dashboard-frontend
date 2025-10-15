import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value)
}

export const formatNumber = (
  value: number,
  options: {
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact'
    maximumFractionDigits?: number
    minimumFractionDigits?: number
  } = {}
): string => {
  const { notation = 'compact', maximumFractionDigits = 2, minimumFractionDigits = 0 } = options
  
  return new Intl.NumberFormat('en-US', {
    notation,
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value)
}

export const formatPercentage = (
  value: number,
  options: {
    signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero'
    maximumFractionDigits?: number
  } = {}
): string => {
  const { signDisplay = 'auto', maximumFractionDigits = 2 } = options
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    signDisplay,
    maximumFractionDigits,
  }).format(value / 100)
}

export const formatMarketCap = (value: number): string => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}

export const formatVolume = (value: number): string => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}

export const formatDate = (date: string | Date, formatString: string = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString)
}

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export const formatPriceChange = (value: number, percentage: number): string => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${formatCurrency(value)} (${formatPercentage(percentage)})`
}

export const formatCoinSymbol = (symbol: string): string => {
  return symbol.toUpperCase()
}

export const formatCoinName = (name: string, symbol: string): string => {
  return `${name} (${formatCoinSymbol(symbol)})`
}
