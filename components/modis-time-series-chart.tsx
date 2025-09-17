'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from 'recharts'
import { useMapStore } from '@/store/map-store'

const formatDate = (value) => {
  const date = new Date(value)

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const ModisTimeSeriesChart = () => {
  const { timeSeries } = useMapStore()

  // Keep original date for X-axis formatting
  const formattedData = timeSeries.map((item) => ({
    ...item,
    date: item.date,
  }))
  console.log(formattedData)

  return (
    <div className="w-[600px] h-80 p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">시간별 농작물 생장량 지수</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tick={{ fontSize: 10 }}
            tickMargin={5}
            minTickGap={32}
            tickFormatter={formatDate}
          >
            <Label value="기간" position="insideBottom" fontSize={12} />
          </XAxis>
          <YAxis
            tickFormatter={(value) => {
              if (value >= 1000) return `${value / 1000}k`

              return `${value}`
            }}
          >
            <Label value="식생 지수[EVI]" angle={-90} position="insideLeft" fontSize={12} />
          </YAxis>
          <Tooltip
            labelFormatter={formatDate}
            formatter={(value: number, name: string) => [value?.toFixed(3), name === 'EVI']}
          />
          <Legend />
          <Area
            type="natural"
            dataKey="EVI"
            stackId="1"
            stroke="var(--chart-3)"
            fill="var(--chart-3)"
            fillOpacity={0.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ModisTimeSeriesChart
