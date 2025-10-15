import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cryptoService } from '@/services/cryptoService'
import { QUERY_KEYS } from '@/utils/constants'
import { CryptoCoin, CryptoChartData, CryptoMarketData } from '@/types'

export function useTopCoins(limit: number = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CRYPTO.TOP_COINS, limit],
    queryFn: async () => {
      try {
        const data = await cryptoService.getTopCoins(limit)
        
        // Ensure we return an array - handle different backend response formats
        if (Array.isArray(data)) {
          return data
        } else if (data && typeof data === 'object') {
          // Handle backend response format: {count: 10, results: [...]}
          if (Array.isArray(data.results)) {
            return data.results
          }
          // Handle alternative format: {data: [...]}
          else if (Array.isArray(data.data)) {
            return data.data
          }
        }
        
        return []
      } catch (error) {
        // Return empty array instead of throwing to prevent UI crashes
        return []
      }
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    retry: 1, // Only retry once
    retryDelay: 2000, // Wait 2 seconds before retry
  })
}

export function useCoinById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CRYPTO.COIN_BY_ID(id),
    queryFn: () => cryptoService.getCoinById(id),
    enabled: !!id,
    staleTime: 30000,
  })
}

export function useCoinPriceHistory(id: string, range: '1d' | '7d' | '30d' | '90d' | '1y' = '7d') {
  return useQuery({
    queryKey: QUERY_KEYS.CRYPTO.PRICE_HISTORY(id, range),
    queryFn: () => cryptoService.getCoinPriceHistory(id, range),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  })
}

export function useMarketData() {
  return useQuery({
    queryKey: QUERY_KEYS.CRYPTO.MARKET_DATA,
    queryFn: async () => {
      try {
        const data = await cryptoService.getMarketData()
        
        // Handle different response formats
        if (data && typeof data === 'object') {
          // If backend returns data directly
          if (data.totalMarketCap !== undefined || data.totalVolume !== undefined) {
            return data
          }
          // If backend returns {results: {...}}
          else if (data.results && typeof data.results === 'object') {
            return data.results
          }
        }
        
        return data
      } catch (error) {
        // Return empty structure instead of throwing
        return {
          totalMarketCap: 0,
          totalVolume: 0,
          marketCapChange24h: 0,
          activeCryptocurrencies: 0
        }
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
  })
}

export function useTrendingCoins() {
  return useQuery({
    queryKey: QUERY_KEYS.CRYPTO.TRENDING,
    queryFn: cryptoService.getTrendingCoins,
    staleTime: 300000, // 5 minutes
  })
}

export function useGainersLosers() {
  return useQuery({
    queryKey: QUERY_KEYS.CRYPTO.GAINERS_LOSERS,
    queryFn: async () => {
      try {
        const data = await cryptoService.getGainersLosers()
        
        // Handle different response formats
        if (data && typeof data === 'object') {
          // If backend returns {gainers: [...], losers: [...]} directly
          if (Array.isArray(data.gainers) && Array.isArray(data.losers)) {
            return data
          }
          // If backend returns {results: {gainers: [...], losers: [...]}}
          else if (data.results && typeof data.results === 'object') {
            return data.results
          }
        }
        
        return data
      } catch (error) {
        // Return empty structure instead of throwing
        return { gainers: [], losers: [] }
      }
    },
    staleTime: 300000, // 5 minutes
  })
}

export function useWatchlist() {
  return useQuery({
    queryKey: QUERY_KEYS.CRYPTO.WATCHLIST,
    queryFn: cryptoService.getWatchlist,
    staleTime: 30000,
  })
}

export function usePortfolio() {
  return useQuery({
    queryKey: QUERY_KEYS.CRYPTO.PORTFOLIO,
    queryFn: cryptoService.getPortfolio,
    staleTime: 30000,
  })
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (coinId: string) => cryptoService.addToWatchlist(coinId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CRYPTO.WATCHLIST })
    },
  })
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (coinId: string) => cryptoService.removeFromWatchlist(coinId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CRYPTO.WATCHLIST })
    },
  })
}

export function useAddToPortfolio() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ coinId, amount, price }: { coinId: string; amount: number; price: number }) =>
      cryptoService.addToPortfolio(coinId, amount, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CRYPTO.PORTFOLIO })
    },
  })
}

export function useUpdatePortfolioEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, amount, price }: { id: string; amount: number; price: number }) =>
      cryptoService.updatePortfolioEntry(id, amount, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CRYPTO.PORTFOLIO })
    },
  })
}

export function useRemoveFromPortfolio() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => cryptoService.removeFromPortfolio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CRYPTO.PORTFOLIO })
    },
  })
}

export function useCoinDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CRYPTO.COIN_BY_ID(id),
    queryFn: () => cryptoService.getCoinDetail(id),
    enabled: !!id,
    staleTime: 30000,
  })
}

