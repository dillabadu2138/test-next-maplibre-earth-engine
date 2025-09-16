'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartLegend, ChartLegendContent } from '@/components/ui/chart'

interface TimeSeriesData {
  date: number
  EVI: number
  NDVI: number
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[]
}

const formatXAxis = (tickItem) => {
  const date = new Date(tickItem)
  const month = date.getMonth()
  const year = date.getFullYear()

  return month === 1 ? year.toString() : month.toString()
}

const ModisTimeSeriesChart = ({ data }: TimeSeriesChartProps) => {
  // Keep original date for X-axis formatting
  const formattedData = data.map((item) => ({
    ...item,
    date: item.date,
  }))
  console.log(formattedData)

  return (
    <div className="w-[500px] h-80 p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">시간별 농작물 생장량 지수</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <XAxis dataKey="date" tickFormatter={formatXAxis} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => `Date: ${value}`}
            formatter={(value: number, name: string) => [
              value?.toFixed(3),
              name === 'EVI' ? 'EVI' : 'NDVI',
            ]}
          />
          <Legend />
          <Area
            type="natural"
            dataKey="EVI"
            stackId="1"
            stroke="var(--chart-3)"
            fill="var(--chart-3)"
            fillOpacity={0.6}
          />
          <Area
            type="natural"
            dataKey="NDVI"
            stackId="1"
            stroke="var(--chart-3)"
            fill="var(--chart-3)"
            fillOpacity={0.4}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ModisTimeSeriesChart
