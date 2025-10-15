import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle, LoadingSpinner } from '@/components/ui'

interface ChartDataPoint {
  timestamp: number
  price: number
  date: string
}

interface CoinChartProps {
  coinId: string
  range: '1d' | '7d' | '30d' | '90d' | '1y'
  data?: ChartDataPoint[]
  isLoading?: boolean
  error?: any
  className?: string
}

const CoinChart: React.FC<CoinChartProps> = ({
  coinId,
  range,
  data = [],
  isLoading = false,
  error,
  className = ''
}) => {
  const formatXAxisLabel = (timestamp: number) => {
    const date = new Date(timestamp)
    switch (range) {
      case '1d':
        return format(date, 'HH:mm')
      case '7d':
        return format(date, 'MMM dd')
      case '30d':
        return format(date, 'MMM dd')
      case '90d':
        return format(date, 'MMM dd')
      case '1y':
        return format(date, 'MMM yyyy')
      default:
        return format(date, 'MMM dd')
    }
  }

  const formatTooltipLabel = (timestamp: number) => {
    const date = new Date(timestamp)
    return format(date, 'MMM dd, yyyy HH:mm')
  }

  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading chart data...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Failed to load chart data
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Please try again later
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No chart data available
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxisLabel}
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip
                labelFormatter={formatTooltipLabel}
                formatter={(value: number) => [formatTooltipValue(value), 'Price']}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default CoinChart
