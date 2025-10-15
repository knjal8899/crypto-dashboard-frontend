import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cryptoService } from '@/services/cryptoService'
import { QUERY_KEYS } from '@/utils/constants'
import { CryptoCoin, CryptoChartData, CryptoMarketData } from '@/types'

export function useTopCoins(limit: number = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CRYPTO.TOP_COINS, limit],
    queryFn: () => cryptoService.getTopCoins(limit),
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
    queryFn: cryptoService.getMarketData,
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
    queryFn: cryptoService.getGainersLosers,
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
