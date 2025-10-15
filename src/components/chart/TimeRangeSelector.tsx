import React from 'react'
import { Button } from '@/components/ui'

interface TimeRangeSelectorProps {
  selectedRange: '1d' | '7d' | '30d' | '90d' | '1y'
  onRangeChange: (range: '1d' | '7d' | '30d' | '90d' | '1y') => void
  className?: string
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onRangeChange,
  className = ''
}) => {
  const ranges = [
    { key: '1d' as const, label: '1D' },
    { key: '7d' as const, label: '7D' },
    { key: '30d' as const, label: '30D' },
    { key: '90d' as const, label: '90D' },
    { key: '1y' as const, label: '1Y' },
  ]

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {ranges.map((range) => (
        <Button
          key={range.key}
          variant={selectedRange === range.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => onRangeChange(range.key)}
          className={`min-w-[60px] ${
            selectedRange === range.key
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}

export default TimeRangeSelector
