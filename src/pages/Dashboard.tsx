import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Star, BarChart3 } from 'lucide-react'
import Header from '@/components/layout/Header'
import MarketOverview from '@/components/dashboard/MarketOverview'
import CryptoTable from '@/components/dashboard/CryptoTable'
import PriceChart from '@/components/dashboard/PriceChart'
import ChatAssistant from '@/components/chat/ChatAssistant'
import { useTopCoins, useGainersLosers } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle, Button, LoadingSpinner } from '@/components/ui'
import { formatCurrency, formatPercentage } from '@/utils/format'

const Dashboard: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  
  const { data: topCoins, isLoading: topCoinsLoading, error: topCoinsError } = useTopCoins(10)
  const { data: gainersLosers, isLoading: gainersLosersLoading, error: gainersLosersError } = useGainersLosers()

  const handleCoinSelect = (coinId: string) => {
    setSelectedCoin(coinId)
  }

  const selectedCoinData = Array.isArray(topCoins) ? topCoins.find(coin => coin.id === selectedCoin) : null

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
                Loading dashboard data...
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
                Please check your backend connection and try again
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
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No cryptocurrency data available
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Please ensure your backend is running and providing data
              </p>
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
            {/* Price Chart */}
            {selectedCoinData ? (
              <PriceChart
                coinId={selectedCoinData.id}
                coinName={selectedCoinData.name}
                coinSymbol={selectedCoinData.symbol}
                currentPrice={selectedCoinData.currentPrice}
                priceChange24h={selectedCoinData.priceChange24h}
                priceChangePercentage24h={selectedCoinData.priceChangePercentage24h}
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
                <CryptoTable 
                  limit={10} 
                  showWatchlist={true}
                  onCoinSelect={handleCoinSelect}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topCoinsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : Array.isArray(topCoins) && topCoins.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Bitcoin Dominance
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {((topCoins[0]?.marketCap / (topCoins.reduce((sum, coin) => sum + coin.marketCap, 0))) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total Market Cap
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(topCoins.reduce((sum, coin) => sum + coin.marketCap, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Active Coins
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {topCoins.length}
                      </span>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>

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
                    {gainersLosers.gainers.slice(0, 5).map((coin) => (
                      <div key={coin.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://via.placeholder.com/24x24/6366f1/ffffff?text=${coin.symbol.charAt(0)}`
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
                    {gainersLosers.losers.slice(0, 5).map((coin) => (
                      <div key={coin.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://via.placeholder.com/24x24/6366f1/ffffff?text=${coin.symbol.charAt(0)}`
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
