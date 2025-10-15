import React, { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/format'
import { useCoinPriceHistory } from '@/hooks'
import { Button, Card, CardContent, CardHeader, CardTitle, LoadingSpinner, Skeleton } from '@/components/ui'
import { CHART_TIME_RANGES, CHART_COLORS } from '@/utils/constants'

interface PriceChartProps {
  coinId: string
  coinName: string
  coinSymbol: string
  currentPrice: number
  priceChange24h: number
  priceChangePercentage24h: number
  className?: string
  initialRange?: '1d' | '7d' | '30d' | '90d' | '1y' | 'max'
}

const PriceChart: React.FC<PriceChartProps> = ({
  coinId,
  coinName,
  coinSymbol,
  currentPrice,
  priceChange24h,
  priceChangePercentage24h,
  className,
  initialRange
}) => {
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d' | '90d' | '1y' | 'max'>(initialRange || '7d')
  const [chartType, setChartType] = useState<'line' | 'area'>('area')
  
  const { data: chartData, isLoading, error } = useCoinPriceHistory(coinId, timeRange)

  // Sync with external initialRange changes
  React.useEffect(() => {
    if (initialRange) {
      setTimeRange(initialRange)
    }
  }, [initialRange])

  // Normalize chart data to objects: { timestamp: number, price: number }
  const normalizedPrices = React.useMemo(() => {
    const raw = (chartData as any)?.prices
    if (!raw || !Array.isArray(raw)) return [] as Array<{ timestamp: number; price: number }>
    const toTs = (v: any): number => {
      if (typeof v === 'number') return v
      const parsed = Date.parse(v)
      return Number.isNaN(parsed) ? 0 : parsed
    }
    return raw
      .map((p: any) => {
        if (Array.isArray(p)) {
          return { timestamp: toTs(p[0]), price: Number(p[1]) }
        }
        if (p && typeof p === 'object') {
          return { timestamp: toTs((p as any).timestamp), price: Number((p as any).price) }
        }
        return null
      })
      .filter(Boolean) as Array<{ timestamp: number; price: number }>
  }, [chartData])

  const isPositive = priceChange24h >= 0

  const formatTooltipValue = (value: number) => {
    return formatCurrency(value)
  }

  const formatTooltipLabel = (label: number) => {
    return formatDate(new Date(label), 'MMM dd, yyyy HH:mm')
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {(() => {
              const date = new Date(Number(label))
              return Number.isNaN(date.getTime()) ? '' : formatTooltipLabel(date.getTime())
            })()}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatTooltipValue(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">
              Failed to load chart data
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!normalizedPrices || normalizedPrices.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400">
            No chart data available
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>{coinName}</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({coinSymbol.toUpperCase()})
              </span>
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(currentPrice)}
              </div>
              <div className={`flex items-center space-x-1 ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {formatCurrency(priceChange24h)} ({formatCurrency(priceChangePercentage24h)}%)
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'line' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              Line
            </Button>
            <Button
              variant={chartType === 'area' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
            >
              Area
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Time Range Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Time Range:</span>
          </div>
          <div className="flex space-x-1">
              {CHART_TIME_RANGES.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range.value as any)}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={normalizedPrices}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPositive ? CHART_COLORS.success : CHART_COLORS.danger}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPositive ? CHART_COLORS.success : CHART_COLORS.danger}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => {
                  const date = new Date(Number(value))
                  return Number.isNaN(date.getTime()) ? '' : formatDate(date, 'MMM dd')
                }} stroke="#6b7280" />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="#6b7280"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? CHART_COLORS.success : CHART_COLORS.danger}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            ) : (
              <LineChart data={normalizedPrices}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => {
                  const date = new Date(Number(value))
                  return Number.isNaN(date.getTime()) ? '' : formatDate(date, 'MMM dd')
                }} stroke="#6b7280" />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="#6b7280"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? CHART_COLORS.success : CHART_COLORS.danger}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default PriceChart
