import apiClient from '@/lib/axios'
import { CryptoCoin, CryptoChartData, CryptoMarketData, CryptoSearchResult, CryptoNews } from '@/types'

export const cryptoService = {
  async getTopCoins(limit: number = 10): Promise<CryptoCoin[]> {
    return apiClient.get<CryptoCoin[]>(`/coins/top?limit=${limit}`)
  },

  async getCoinById(id: string): Promise<CryptoCoin> {
    return apiClient.get<CryptoCoin>(`/coins/${id}`)
  },

  async getCoinPriceHistory(
    id: string,
    timeRange: '1d' | '7d' | '30d' | '90d' | '1y' | 'max' = '7d'
  ): Promise<CryptoChartData> {
    return apiClient.get<CryptoChartData>(`/coins/${id}/price-history?range=${timeRange}`)
  },

  async getMarketData(): Promise<CryptoMarketData> {
    return apiClient.get<CryptoMarketData>('/coins/market-data')
  },

  async searchCoins(query: string): Promise<CryptoSearchResult[]> {
    return apiClient.get<CryptoSearchResult[]>(`/coins/search?q=${encodeURIComponent(query)}`)
  },

  async getTrendingCoins(): Promise<CryptoCoin[]> {
    return apiClient.get<CryptoCoin[]>('/coins/trending')
  },

  async getGainersLosers(): Promise<{ gainers: CryptoCoin[]; losers: CryptoCoin[] }> {
    return apiClient.get<{ gainers: CryptoCoin[]; losers: CryptoCoin[] }>('/coins/gainers-losers')
  },

  async getCryptoNews(limit: number = 10): Promise<CryptoNews[]> {
    return apiClient.get<CryptoNews[]>(`/news?limit=${limit}`)
  },

  async getCoinNews(coinId: string, limit: number = 5): Promise<CryptoNews[]> {
    return apiClient.get<CryptoNews[]>(`/news/coin/${coinId}?limit=${limit}`)
  },

  async getWatchlist(): Promise<CryptoCoin[]> {
    return apiClient.get<CryptoCoin[]>('/coins/watchlist')
  },

  async addToWatchlist(coinId: string): Promise<void> {
    return apiClient.post<void>(`/coins/watchlist/${coinId}`, {})
  },

  async removeFromWatchlist(coinId: string): Promise<void> {
    return apiClient.delete<void>(`/coins/watchlist/${coinId}`)
  },

  async getPortfolio(): Promise<any[]> {
    return apiClient.get<any[]>('/coins/portfolio')
  },

  async addToPortfolio(coinId: string, amount: number, price: number): Promise<void> {
    return apiClient.post<void>('/coins/portfolio', {
      coinId,
      amount,
      price,
    })
  },

  async updatePortfolioEntry(id: string, amount: number, price: number): Promise<void> {
    return apiClient.put<void>(`/coins/portfolio/${id}`, {
      amount,
      price,
    })
  },

  async removeFromPortfolio(id: string): Promise<void> {
    return apiClient.delete<void>(`/coins/portfolio/${id}`)
  },

  async getCoinDetail(id: string): Promise<any> {
    return apiClient.get<any>(`/coins/${id}/detail`)
  },
}
