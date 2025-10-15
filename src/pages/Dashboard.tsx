import React, { useEffect, useMemo, useState } from 'react'
import { TrendingUp, TrendingDown, Star, BarChart3 } from 'lucide-react'
import Header from '@/components/layout/Header'
import MarketOverview from '@/components/dashboard/MarketOverview'
import CryptoTable from '@/components/dashboard/CryptoTable'
import PriceChart from '@/components/dashboard/PriceChart'
import ChatAssistant from '@/components/chat/ChatAssistant'
import { useTopCoins, useGainersLosers } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle, Button, LoadingSpinner } from '@/components/ui'
import { formatPercentage } from '@/utils/format'

const Dashboard: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const [selectedRange, setSelectedRange] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('7d')
  const [showChat, setShowChat] = useState(false)
  
  const { data: topCoins, isLoading: topCoinsLoading, error: topCoinsError } = useTopCoins(10)
  const { data: gainersLosers, isLoading: gainersLosersLoading } = useGainersLosers()

  const handleCoinSelect = (coinId: string) => {
    setSelectedCoin(coinId)
  }

  const firstCoinId = useMemo(() => (Array.isArray(topCoins) && topCoins.length > 0 ? topCoins[0].id : null), [topCoins])
  useEffect(() => {
    if (!selectedCoin && firstCoinId) {
      setSelectedCoin(firstCoinId)
    }
  }, [firstCoinId, selectedCoin])

  const selectedCoinData = useMemo(() => (
    Array.isArray(topCoins) ? topCoins.find(coin => coin.id === selectedCoin) : null
  ), [topCoins, selectedCoin])

  // Show loading state while data is being fetched
  if (topCoinsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading...
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Show error state if data failed to load
  if (topCoinsError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Failed to load dashboard data
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please try again in a moment
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Show empty state if no data is available
  if (!Array.isArray(topCoins) || topCoins.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No cryptocurrency data available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Unable to load cryptocurrency data at this time.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                  Please check your connection and try again.
                </p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Retry Connection
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Crypto Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your favorite cryptocurrencies and stay updated with market trends
          </p>
        </div>

        {/* Market Overview */}
        <div className="mb-8">
          <MarketOverview />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts and Top Coins */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Controls (above chart) */}
            <Card>
              <CardHeader>
                <CardTitle>Chart Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Coin</label>
                    <select
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-gray-900 dark:text-white"
                      value={selectedCoin || ''}
                      onChange={(e) => setSelectedCoin(e.target.value)}
                    >
                      {(Array.isArray(topCoins) ? topCoins : []).map((coin: any) => (
                        <option key={coin.id} value={coin.id}>
                          {coin.name} ({(coin.symbol || '').toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full sm:w-48">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Range</label>
                    <select
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-gray-900 dark:text-white"
                      value={selectedRange}
                      onChange={(e) => setSelectedRange(e.target.value as any)}
                    >
                      <option value="1d">1 Day</option>
                      <option value="7d">7 Days</option>
                      <option value="30d">30 Days</option>
                      <option value="90d">90 Days</option>
                      <option value="1y">1 Year</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Chart */}
            {selectedCoinData ? (
              <PriceChart
                coinId={selectedCoinData.id}
                coinName={selectedCoinData.name}
                coinSymbol={selectedCoinData.symbol}
                currentPrice={selectedCoinData.currentPrice}
                priceChange24h={selectedCoinData.priceChange24h}
                priceChangePercentage24h={selectedCoinData.priceChangePercentage24h}
                initialRange={selectedRange}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Price Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Select a coin from the table to view its price chart
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Cryptocurrencies Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Top Cryptocurrencies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[28rem] overflow-auto">
                  <CryptoTable 
                    limit={50}
                    showWatchlist={true}
                    onCoinSelect={handleCoinSelect}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats section removed as requested */}

            {/* Top Gainers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Top Gainers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gainersLosersLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : gainersLosers?.gainers ? (
                  <div className="space-y-3">
                    {gainersLosers.gainers.slice(0, 5).map((coin: any) => (
                      <div key={coin.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `data:image/svg+xml;base64,${btoa(`<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#6366f1"/><text x="12" y="16" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">${(coin.symbol || '?').charAt(0)}</text></svg>`)}`
                            }}
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {coin.symbol.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          +{formatPercentage(coin.priceChangePercentage24h)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Top Losers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <span>Top Losers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gainersLosersLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : gainersLosers?.losers ? (
                  <div className="space-y-3">
                    {gainersLosers.losers.slice(0, 5).map((coin: any) => (
                      <div key={coin.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `data:image/svg+xml;base64,${btoa(`<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#6366f1"/><text x="12" y="16" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">${(coin.symbol || '?').charAt(0)}</text></svg>`)}`
                            }}
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {coin.symbol.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {formatPercentage(coin.priceChangePercentage24h)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Chat Assistant */}
            <div className="sticky top-8">
              <ChatAssistant 
                isOpen={showChat}
                onClose={() => setShowChat(false)}
                className="h-96"
              />
              {!showChat && (
                <Button
                  onClick={() => setShowChat(true)}
                  className="w-full"
                  variant="outline"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Open Chat Assistant
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
