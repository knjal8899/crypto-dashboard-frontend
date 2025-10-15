export interface CryptoCoin {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  marketCap: number
  marketCapRank: number
  fullyDilutedValuation?: number
  totalVolume: number
  high24h: number
  low24h: number
  priceChange24h: number
  priceChangePercentage24h: number
  marketCapChange24h: number
  marketCapChangePercentage24h: number
  circulatingSupply: number
  totalSupply?: number
  maxSupply?: number
  ath: number
  athChangePercentage: number
  athDate: string
  atl: number
  atlChangePercentage: number
  atlDate: string
  lastUpdated: string
}

export interface CryptoPriceData {
  timestamp: number
  price: number
  volume?: number
}

export interface CryptoChartData {
  coinId: string
  symbol: string
  name: string
  prices: CryptoPriceData[]
  timeRange: '1d' | '7d' | '30d' | '90d' | '1y' | 'max'
}

export interface CryptoMarketData {
  coins: CryptoCoin[]
  totalMarketCap: number
  totalVolume: number
  marketCapChangePercentage24h: number
  lastUpdated: string
}

export interface CryptoSearchResult {
  id: string
  symbol: string
  name: string
  image: string
  marketCapRank: number
}

export interface CryptoNews {
  id: string
  title: string
  summary: string
  url: string
  imageUrl?: string
  publishedAt: string
  source: string
  sentiment?: 'positive' | 'negative' | 'neutral'
}
