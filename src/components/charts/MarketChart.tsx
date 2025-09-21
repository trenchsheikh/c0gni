'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Simple chart components without external dependencies
interface ChartData {
  label: string
  value: number
  change?: number
  color?: string
}

interface MarketChartProps {
  data: ChartData[]
  type: 'bar' | 'line' | 'pie' | 'price'
  title?: string
  height?: number
  className?: string
}

export function MarketChart({ data, type, title, height = 300, className = '' }: MarketChartProps) {
  const [animatedData, setAnimatedData] = useState<ChartData[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate data loading
    const timer = setTimeout(() => {
      setAnimatedData(data)
    }, 100)
    return () => clearTimeout(timer)
  }, [data])

  const maxValue = Math.max(...data.map(d => Math.abs(d.value)))

  const renderBarChart = () => (
    <div className="flex items-end justify-between h-full px-4 pb-4">
      {animatedData.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ height: 0 }}
          animate={{ height: `${(Math.abs(item.value) / maxValue) * 80}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          className="flex flex-col items-center min-w-[60px]"
        >
          <motion.div
            className={`w-8 rounded-t-lg ${
              item.color || (item.value >= 0 ? 'bg-green-400' : 'bg-red-400')
            }`}
            style={{
              height: `${(Math.abs(item.value) / maxValue) * 100}%`,
              minHeight: '4px'
            }}
          />
          <div className="mt-2 text-xs text-white/60 text-center">
            <div className="truncate max-w-[60px]">{item.label}</div>
            <div className="font-medium text-white">
              {item.value.toLocaleString()}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderLineChart = () => {
    const width = 100
    const points = animatedData.map((item, index) => {
      const x = (index / (animatedData.length - 1)) * width
      const y = 80 - (item.value / maxValue) * 60
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="relative h-full p-4">
        <svg
          viewBox={`0 0 ${width} 80`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.polyline
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            points={points}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {animatedData.map((item, index) => {
            const x = (index / (animatedData.length - 1)) * width
            const y = 80 - (item.value / maxValue) * 60
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="rgb(59, 130, 246)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 1 }}
              />
            )
          })}
        </svg>
        <div className="absolute bottom-0 left-4 right-4 flex justify-between text-xs text-white/60">
          {data.map((item, index) => (
            <span key={index} className="truncate max-w-[80px]">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    )
  }

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + Math.abs(item.value), 0)
    let currentAngle = 0

    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {animatedData.map((item, index) => {
              const percentage = Math.abs(item.value) / total
              const angle = percentage * 360
              const startAngle = currentAngle
              currentAngle += angle

              const startX = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180)
              const startY = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180)
              const endX = 100 + 80 * Math.cos((startAngle + angle - 90) * Math.PI / 180)
              const endY = 100 + 80 * Math.sin((startAngle + angle - 90) * Math.PI / 180)
              const largeArc = angle > 180 ? 1 : 0

              const pathData = [
                `M 100 100`,
                `L ${startX} ${startY}`,
                `A 80 80 0 ${largeArc} 1 ${endX} ${endY}`,
                'Z'
              ].join(' ')

              const colors = [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(245, 101, 101)',
                'rgb(251, 191, 36)',
                'rgb(139, 92, 246)'
              ]

              return (
                <motion.path
                  key={index}
                  d={pathData}
                  fill={item.color || colors[index % colors.length]}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{total.toLocaleString()}</div>
              <div className="text-xs text-white/60">Total</div>
            </div>
          </div>
        </div>
        <div className="ml-6 space-y-2">
          {data.map((item, index) => {
            const colors = [
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(245, 101, 101)',
              'rgb(251, 191, 36)',
              'rgb(139, 92, 246)'
            ]
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color || colors[index % colors.length] }}
                />
                <span className="text-white/80">{item.label}</span>
                <span className="text-white font-medium ml-auto">
                  {item.value.toLocaleString()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderPriceChart = () => (
    <div className="space-y-3 p-4">
      {animatedData.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white/80 text-xs font-medium">
                {item.label.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-white font-medium">{item.label}</div>
              {item.change !== undefined && (
                <div className={`text-sm ${
                  item.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">
              ${item.value.toLocaleString()}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}
      style={{ height }}
    >
      {title && (
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white font-medium text-lg">{title}</h3>
        </div>
      )}
      <div className="flex-1" style={{ height: title ? height - 60 : height }}>
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {type === 'pie' && renderPieChart()}
        {type === 'price' && renderPriceChart()}
      </div>
    </motion.div>
  )
}

// Market overview component with multiple charts
interface MarketOverviewProps {
  marketData?: any[]
  className?: string
}

export function MarketOverview({ marketData = [], className = '' }: MarketOverviewProps) {
  if (!marketData.length) {
    return (
      <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center ${className}`}>
        <div className="text-white/60">No market data available</div>
      </div>
    )
  }

  // Transform market data for charts
  const volumeData = marketData.slice(0, 5).map(market => ({
    label: market.symbol || market.question?.substring(0, 10) + '...' || 'Market',
    value: market.volume24h || market.volume || 0,
    color: 'rgb(59, 130, 246)'
  }))

  const priceData = marketData.slice(0, 8).map(market => ({
    label: market.symbol || market.question?.substring(0, 20) + '...' || 'Market',
    value: market.markPrice || market.yesPrice || market.price || 0,
    change: market.priceChangePercent24h || market.change24h || 0
  }))

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid md:grid-cols-2 gap-6">
        <MarketChart
          data={volumeData}
          type="bar"
          title="Top Markets by Volume"
          height={300}
        />
        <MarketChart
          data={priceData}
          type="price"
          title="Market Prices"
          height={300}
        />
      </div>
    </div>
  )
}

// Simple sparkline component for inline charts
interface SparklineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
  className?: string
}

export function Sparkline({
  data,
  color = 'rgb(59, 130, 246)',
  width = 100,
  height = 20,
  className = ''
}: SparklineProps) {
  if (!data.length) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      <motion.polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </svg>
  )
}