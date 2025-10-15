import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import { formatCurrency, formatPercentage, formatMarketCap } from '@/utils/format'
import { useMarketData } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle, LoadingSpinner, Skeleton } from '@/components/ui'

const MarketOverview: React.FC = () => {
  const { data: marketData, isLoading, error } = useMarketData()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center justify-center h-24">
            <p className="text-red-600 dark:text-red-400 text-sm">
              Failed to load market data
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!marketData) {
    return null
  }

  // Debug: Log the market data structure
  console.log('Market data structure:', marketData)

  // Handle both array format (from market-data endpoint) and object format
  let coins: any[] = []
  let totalMarketCap = 0
  let totalVolume = 0
  let marketCapChangePercentage24h = 0

  if (Array.isArray(marketData)) {
    // If marketData is an array of coins (like top coins)
    coins = marketData
    totalMarketCap = coins.reduce((sum, coin) => {
      const marketCap = parseFloat(coin.last_price_usd || coin.currentPrice || coin.price || 0) * 
                       parseFloat(coin.circulating_supply || coin.circulatingSupply || 1000000)
      return sum + marketCap
    }, 0)
    totalVolume = coins.reduce((sum, coin) => {
      return sum + parseFloat(coin.last_volume_24h_usd || coin.totalVolume || coin.volume_24h || 0)
    }, 0)
    marketCapChangePercentage24h = coins.length > 0 ? 
      coins.reduce((sum, coin) => sum + parseFloat(coin.last_pct_change_24h || coin.priceChangePercentage24h || 0), 0) / coins.length : 0
  } else if (marketData && typeof marketData === 'object') {
    // If marketData is an object with aggregated data
    coins = marketData.coins || []
    totalMarketCap = marketData.totalMarketCap || marketData.total_market_cap || marketData.market_cap || 0
    totalVolume = marketData.totalVolume || marketData.total_volume || marketData.volume_24h || 0
    marketCapChangePercentage24h = marketData.marketCapChangePercentage24h || marketData.market_cap_change_percentage_24h || 0
  }

  const isMarketPositive = marketCapChangePercentage24h >= 0

  const stats = [
    {
      title: 'Total Market Cap',
      value: formatMarketCap(totalMarketCap),
      change: marketCapChangePercentage24h,
      icon: DollarSign,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: '24h Volume',
      value: formatMarketCap(totalVolume),
      change: 0, // Volume change not provided in the data
      icon: BarChart3,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Market Change',
      value: formatPercentage(marketCapChangePercentage24h),
      change: marketCapChangePercentage24h,
      icon: isMarketPositive ? TrendingUp : TrendingDown,
      color: isMarketPositive 
        ? 'text-green-600 dark:text-green-400' 
        : 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Active Coins',
      value: coins.length.toString(),
      change: 0,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const isPositive = stat.change >= 0
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              {stat.change !== 0 && (
                <div className={`flex items-center text-xs ${
                  isPositive 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span>
                    {formatPercentage(Math.abs(stat.change))} from 24h ago
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default MarketOverview
