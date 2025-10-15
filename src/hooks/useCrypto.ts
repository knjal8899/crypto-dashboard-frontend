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
        console.log('Top coins API response:', data)
        
        // Ensure we return an array
        if (Array.isArray(data)) {
          return data
        } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
          return data.data
        } else {
          console.error('Unexpected API response format:', data)
          return []
        }
      } catch (error) {
        console.error('Error fetching top coins:', error)
        throw error
      }
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
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

export function useCoinPriceHistory(id: string, timeRange: '1d' | '7d' | '30d' | '90d' | '1y' | 'max' = '7d') {
  return useQuery({
    queryKey: QUERY_KEYS.CRYPTO.PRICE_HISTORY(id, timeRange),
    queryFn: () => cryptoService.getCoinPriceHistory(id, timeRange),
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
        console.log('Market data API response:', data)
        return data
      } catch (error) {
        console.error('Error fetching market data:', error)
        throw error
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
        console.log('Gainers/Losers API response:', data)
        return data
      } catch (error) {
        console.error('Error fetching gainers/losers:', error)
        throw error
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
