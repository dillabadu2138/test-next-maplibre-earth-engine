'use client'

import MapContextProvider from '@/map/map-context-provider'
import useMapContext from './use-map-context'
import Map, { Layer, Source } from 'react-map-gl/maplibre'
import MapControls from './map-controls'
import ModisTimeSeriesChart from '@/components/modis-time-series-chart'
import MapDrawControls from '@/components/map-draw-controls'
import { useMapStore } from '@/store/map-store'
import { useEffect } from 'react'
import { getTimeSeriesByRegion, ndvi } from '@/module/server'
import type { StyleSpecification } from 'maplibre-gl'
import ControlPanel from '@/components/control-panel'

const customMapStyle: StyleSpecification = {
  version: 8,
  name: 'Custom Globe Style',
  projection: {
    type: ['interpolate', ['exponential', 0.5], ['zoom'], 2, 'globe', 6, 'mercator'],
  },
  sources: {
    satellite: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: 'satellite-layer',
      type: 'raster',
      source: 'satellite',
    },
  ],
}

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
    setIsLoadingTile,
    setIsLoadingTimeSeries,
    resetTile,
    resetTimeSeries,
  } = useMapStore()

  const loadLandsatTile = async () => {
    try {
      // Set loading to true
      setIsLoadingTile(true)

      // Clear previous tile
      resetTile()

      const { urlFormat } = await ndvi({ startYear, coordinates, visParams })
      console.log('Tile URL:', urlFormat)
      setTile([urlFormat])
    } catch (error) {
      console.error('Failed to load Landsat NDVI tile data:', error)
    } finally {
      setIsLoadingTile(false)
    }
  }

  const loadModisTimeSeriesByRegion = async () => {
    try {
      // Set loading to true
      setIsLoadingTimeSeries(true)

      // Clear previous time series
      resetTimeSeries()

      const timeSeriesData = await getTimeSeriesByRegion({ startYear, endYear, coordinates })
      console.log('Time Series Data:', timeSeriesData)
      const data = timeSeriesData['features'].map((e) => e.properties)
      console.log(data)
      setTimeSeries(data)
    } catch (error) {
      console.error('Failed to load MODIS time series data:', error)
    } finally {
      setIsLoadingTimeSeries(false)
    }
  }

  return (
    <div className="absolute overflow-hidden inset-0 w-screen h-screen bg-slate-900">
      {/* 지도 */}
      <Map
        ref={(e) => setMap && setMap(e || undefined)}
        initialViewState={{ longitude: 127, latitude: 35, zoom: 3 }}
        mapStyle={customMapStyle}
      >
        <MapControls />
        <MapDrawControls />
        {/* 래스터 타일 */}
        {tile && (
          <Source id="ndvi" type="raster" tiles={tile}>
            <Layer id="ndvi" type="raster" />
          </Source>
        )}
      </Map>

      {/* 컨트롤 패널 */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <ControlPanel
          onApply={() => {
            loadLandsatTile()
            loadModisTimeSeriesByRegion()
          }}
        />
      </div>

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
