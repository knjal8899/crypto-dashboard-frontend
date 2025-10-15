import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, Star, StarOff, Plus, Minus } from 'lucide-react'
import { formatCurrency, formatPercentage, formatMarketCap, formatVolume } from '@/utils/format'
import { useTopCoins, useAddToWatchlist, useRemoveFromWatchlist } from '@/hooks'
import { Button, Badge, Skeleton, SkeletonTable } from '@/components/ui'
import { CryptoCoin } from '@/types'

interface CryptoTableProps {
  limit?: number
  showWatchlist?: boolean
  className?: string
  onCoinSelect?: (coinId: string) => void
}

const CryptoTable: React.FC<CryptoTableProps> = ({ 
  limit = 10, 
  showWatchlist = true,
  className,
  onCoinSelect
}) => {
  const navigate = useNavigate()
  const [watchlist, setWatchlist] = useState<string[]>([])
  const { data: coins, isLoading, error } = useTopCoins(limit)
  const addToWatchlistMutation = useAddToWatchlist()
  const removeFromWatchlistMutation = useRemoveFromWatchlist()

  const handleCoinClick = (coinId: string) => {
    navigate(`/coin/${coinId}`)
  }

  const handleWatchlistToggle = async (coinId: string) => {
    const isInWatchlist = watchlist.includes(coinId)
    
    try {
      if (isInWatchlist) {
        await removeFromWatchlistMutation.mutateAsync(coinId)
        setWatchlist(prev => prev.filter(id => id !== coinId))
      } else {
        await addToWatchlistMutation.mutateAsync(coinId)
        setWatchlist(prev => [...prev, coinId])
      }
    } catch (error: any) {
      console.error('Watchlist toggle failed:', error)
      // Show user-friendly error message
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Failed to update watchlist'
      alert(`Error: ${errorMessage}`)
    }
  }

  if (isLoading) {
    return (
      <div className={className}>
        <SkeletonTable rows={limit} columns={6} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-600 dark:text-red-400">
          Failed to load crypto data. Please try again.
        </p>
      </div>
    )
  }

  if (!coins || coins.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">
          No crypto data available.
        </p>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                #
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Coin
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Price
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                24h Change
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Market Cap
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                Volume
              </th>
              {showWatchlist && (
                <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const isPositive = (coin.priceChangePercentage24h || 0) >= 0
              const isInWatchlist = watchlist.includes(coin.id)
              
              return (
                <tr
                  key={coin.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {coin.marketCapRank || coin.rank || 'N/A'}
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
                      onClick={() => handleCoinClick(coin.id)}
                    >
                      <img
                        src={coin.image || `data:image/svg+xml;base64,${btoa(`<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="#6366f1"/><text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">${(coin.symbol || '?').charAt(0)}</text></svg>`)}`}
                        alt={coin.name || 'Unknown'}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `data:image/svg+xml;base64,${btoa(`<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="#6366f1"/><text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">${(coin.symbol || '?').charAt(0)}</text></svg>`)}`
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {coin.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {(coin.symbol || '?').toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(coin.currentPrice || coin.last_price_usd || coin.price)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className={`flex items-center justify-end space-x-1 ${
                      isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {formatPercentage(coin.priceChangePercentage24h || coin.price_change_percentage_24h || coin.price_change_24h)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatMarketCap(coin.marketCap || coin.market_cap || coin.market_cap_usd)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatVolume(coin.totalVolume || coin.total_volume || coin.volume_24h)}
                    </div>
                  </td>
                  {showWatchlist && (
                    <td className="py-4 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleWatchlistToggle(coin.id) }}
                        className="p-2"
                        aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                        title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        {isInWatchlist ? (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CryptoTable
