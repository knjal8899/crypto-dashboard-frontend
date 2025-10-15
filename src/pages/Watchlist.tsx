import React, { useMemo } from 'react'
import Header from '@/components/layout/Header'
import { useWatchlist, useRemoveFromWatchlist, useTopCoins } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle, Button, Skeleton } from '@/components/ui'
import { formatCurrency, formatMarketCap, formatPercentage } from '@/utils/format'
import { TrendingUp, TrendingDown } from 'lucide-react'

const Watchlist: React.FC = () => {
  const { data: watchlistIds, isLoading: watchlistLoading, error: watchlistError } = useWatchlist()
  const { data: allCoins, isLoading: coinsLoading } = useTopCoins(100) // Get more coins to match watchlist
  const removeMutation = useRemoveFromWatchlist()

  // Match watchlist IDs with full coin data
  const coins = useMemo(() => {
    if (!watchlistIds || !allCoins) return []
    
    // Handle both array of IDs and array of coin objects
    if (Array.isArray(watchlistIds)) {
      if (watchlistIds.length > 0 && typeof watchlistIds[0] === 'string') {
        // Array of IDs: ["bitcoin", "ethereum", ...]
        return watchlistIds
          .map((id: string) => allCoins.find((coin: any) => coin.id === id))
          .filter(Boolean)
      } else {
        // Array of coin objects: [{id: "bitcoin", name: "Bitcoin", ...}, ...]
        return watchlistIds
      }
    }
    return []
  }, [watchlistIds, allCoins])

  const isLoading = watchlistLoading || coinsLoading
  const error = watchlistError

  const handleRemove = async (coinId: string) => {
    try {
      await removeMutation.mutateAsync(coinId)
    } catch (e) {
      // no-op, UI stays consistent via refetch
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Watchlist</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Coins you are tracking</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Coins</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : error ? (
              <div className="text-red-600 dark:text-red-400">Failed to load watchlist.</div>
            ) : !coins || coins.length === 0 ? (
              <div className="text-gray-600 dark:text-gray-400">Your watchlist is empty.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Coin</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Price</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">24h</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Market Cap</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coins.map((coin: any) => {
                      const isPositive = (coin.priceChangePercentage24h || coin.last_pct_change_24h || 0) >= 0
                      return (
                        <tr key={coin.id} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-8 h-8 rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = `data:image/svg+xml;base64,${btoa(`<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="#6366f1"/><text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">${(coin.symbol || '?').charAt(0)}</text></svg>`)}`
                                }}
                              />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{coin.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{(coin.symbol || '?').toUpperCase()}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">{formatCurrency(coin.currentPrice || coin.last_price_usd || coin.price)}</td>
                          <td className="py-4 px-4 text-right">
                            <div className={`flex items-center justify-end space-x-1 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              <span>{formatPercentage(coin.priceChangePercentage24h || coin.last_pct_change_24h || 0)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">{formatMarketCap(coin.marketCap || coin.market_cap || coin.market_cap_usd)}</td>
                          <td className="py-4 px-4 text-right">
                            <Button size="sm" variant="outline" onClick={() => handleRemove(coin.id)}>Remove</Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Watchlist


