import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface TimeSeriesData {
  date: number
  EVI: number
  NDVI: number
}

interface VisParams {
  min: number
  max: number
  palette: string[]
}

interface MapState {
  tile: string[] | null
  timeSeries: TimeSeriesData[]
  startYear: number
  endYear: number
  coordinates: number[][]
  visParams: VisParams
  isLoadingTile: boolean
  isLoadingTimeSeries: boolean

  setTile: (tile: string[] | null) => void
  setTimeSeries: (timeSeries: TimeSeriesData[]) => void
  setStartYear: (startYear: number) => void
  setEndYear: (endYear: number) => void
  setCoordinates: (coordinates: number[][]) => void
  setVisParams: (visParams: VisParams) => void
  setIsLoadingTile: (loading: boolean) => void
  setIsLoadingTimeSeries: (loading: boolean) => void
  resetTile: () => void
  resetTimeSeries: () => void
}

export const useMapStore = create<MapState>()(
  devtools(
    (set) => ({
      tile: null,
      timeSeries: [],
      startYear: 2018,
      endYear: 2023,
      isLoadingTile: false,
      isLoadingTimeSeries: false,
      coordinates: [
        [120.61733763183594, 33.94630141529378],
        [132.43862669433594, 33.94630141529378],
        [132.43862669433594, 43.26378821701301],
        [120.61733763183594, 43.26378821701301],
        [120.61733763183594, 33.94630141529378],
      ],
      visParams: {
        min: 0,
        max: 1,
        palette: [
          'ffffff',
          'ce7e45',
          'df923d',
          'f1b555',
          'fcd163',
          '99b718',
          '74a901',
          '66a000',
          '529400',
          '3e8601',
          '207401',
          '056201',
          '004c00',
          '023b01',
          '012e01',
          '011d01',
          '011301',
        ],
      },
      setTile: (tile) => set({ tile }),
      setTimeSeries: (timeSeries) => set({ timeSeries }),
      setStartYear: (startYear) => set({ startYear }),
      setEndYear: (endYear) => set({ endYear }),
      setCoordinates: (coordinates) => set({ coordinates }),
      setVisParams: (visParams) => set({ visParams }),
      setIsLoadingTile: (loading) => set({ isLoadingTile: loading }),
      setIsLoadingTimeSeries: (loading) => set({ isLoadingTimeSeries: loading }),
      // Reset
      resetTile: () => set({ tile: null }),
      resetTimeSeries: () => set({ timeSeries: [] }),
    }),
    { name: 'mapStore' }
  )
)
