import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import Header from '@/components/layout/Header'
import CoinChart from '@/components/chart/CoinChart'
import TimeRangeSelector from '@/components/chart/TimeRangeSelector'
import { useCoinDetail, useCoinPriceHistory } from '@/hooks'
import { Button, Card, CardContent, CardHeader, CardTitle, LoadingSpinner } from '@/components/ui'
import { formatCurrency, formatPercentage, formatMarketCap, formatNumber } from '@/utils/format'

const CoinDetail: React.FC = () => {
  const { coinId } = useParams<{ coinId: string }>()
  const navigate = useNavigate()
  const [selectedRange, setSelectedRange] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('7d')

  const { data: coinDetail, isLoading: detailLoading, error: detailError } = useCoinDetail(coinId || '')
  const { data: priceHistory, isLoading: chartLoading, error: chartError } = useCoinPriceHistory(coinId || '', selectedRange)

  const handleBackClick = () => {
    navigate('/dashboard')
  }

  const handleRangeChange = (range: '1d' | '7d' | '30d' | '90d' | '1y') => {
    setSelectedRange(range)
  }

  // Transform price history data for chart
  const chartData = priceHistory?.prices?.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
    date: new Date(timestamp).toISOString(),
  })) || []

  if (detailLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading coin details...
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (detailError || !coinDetail) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Failed to load coin details
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The coin you're looking for might not exist
              </p>
              <Button onClick={handleBackClick}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const isPositive = (coinDetail.priceChange24h || coinDetail.priceChangePercentage24h || 0) >= 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackClick}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>

        {/* Coin Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={coinDetail.image || `data:image/svg+xml;base64,${btoa(`<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" fill="#6366f1"/><text x="32" y="40" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">${(coinDetail.symbol || '?').charAt(0)}</text></svg>`)}`}
              alt={coinDetail.name || 'Unknown'}
              className="w-16 h-16 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `data:image/svg+xml;base64,${btoa(`<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" fill="#6366f1"/><text x="32" y="40" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">${(coinDetail.symbol || '?').charAt(0)}</text></svg>`)}`
              }}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {coinDetail.name || 'Unknown'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {(coinDetail.symbol || '?').toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(coinDetail.currentPrice || coinDetail.last_price_usd || coinDetail.price)}
              </p>
            </div>
            <div className={`flex items-center space-x-1 ${
              isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span className="text-lg font-medium">
                {formatPercentage(coinDetail.priceChange24h || coinDetail.priceChangePercentage24h || coinDetail.price_change_percentage_24h || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Market Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Market Cap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMarketCap(coinDetail.marketCap || coinDetail.market_cap || coinDetail.market_cap_usd)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                24h Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMarketCap(coinDetail.totalVolume || coinDetail.total_volume || coinDetail.volume_24h)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                #{coinDetail.marketCapRank || coinDetail.rank || 'N/A'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Circulating Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(coinDetail.circulatingSupply || coinDetail.circulating_supply || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Price Chart
            </h2>
            <TimeRangeSelector
              selectedRange={selectedRange}
              onRangeChange={handleRangeChange}
            />
          </div>

          <CoinChart
            coinId={coinId || ''}
            range={selectedRange}
            data={chartData}
            isLoading={chartLoading}
            error={chartError}
          />
        </div>
      </main>
    </div>
  )
}

export default CoinDetail
