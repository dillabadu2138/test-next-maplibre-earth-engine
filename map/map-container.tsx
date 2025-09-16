'use client'

import MapContextProvider from '@/map/map-context-provider'
import useMapContext from './use-map-context'
import Map, { Layer, Source } from 'react-map-gl/maplibre'
import MapControls from './map-controls'
import ModisTimeSeriesChart from '@/components/modis-time-series-chart'
import { useMapStore } from '@/store/map-store'
import { useEffect } from 'react'
import { getTimeSeriesByRegion, ndvi } from '@/module/server'

const MapInner = () => {
  const { setMap, map } = useMapContext()

  const {
    tile,
    timeSeries,
    startYear,
    endYear,
    coordinates,
    visParams,
    setTile,
    setTimeSeries,
    resetTile,
    resetTimeSeries,
  } = useMapStore()

  const loadLandsatTile = async () => {
    try {
      // Clear previous tile
      resetTile()

      const { urlFormat } = await ndvi({ startYear, coordinates, visParams })
      console.log('Tile URL:', urlFormat)
      setTile([urlFormat])
    } catch (error) {
      console.error('Failed to load Landsat NDVI data:', error)
    }
  }

  const loadTimeSeriesByRegion = async () => {
    try {
      // Clear previous time series
      resetTimeSeries()

      const timeSeriesData = await getTimeSeriesByRegion({ startYear, endYear, coordinates })
      console.log('Time Series Data:', timeSeriesData)
      const data = timeSeriesData['features'].map((e) => e.properties)
      console.log(data)
      setTimeSeries(data)
    } catch (error) {
      console.error('Failed to load MODIS time series data:', error)
    }
  }

  // Load initial tile
  useEffect(() => {
    loadLandsatTile()
    loadTimeSeriesByRegion()
  }, [])

  return (
    <div className="absolute overflow-hidden inset-0">
      {/* 지도 */}
      <Map
        ref={(e) => setMap && setMap(e || undefined)}
        initialViewState={{ longitude: 127, latitude: 35, zoom: 3 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        projection="globe"
      >
        <MapControls />
        {/* 래스터 타일 */}
        {tile && (
          <Source id="ndvi" type="raster" tiles={tile}>
            <Layer id="ndvi" type="raster" />
          </Source>
        )}
      </Map>

      {/* 시계열 차트 */}
      {timeSeries.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10">
          <ModisTimeSeriesChart />
        </div>
      )}
    </div>
  )
}

// Context pass through
const MapContainer = () => {
  return (
    <MapContextProvider>
      <MapInner />
    </MapContextProvider>
  )
}

export default MapContainer
