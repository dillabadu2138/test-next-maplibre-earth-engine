'use client'

import MapContextProvider from '@/map/map-context-provider'
import useMapContext from './use-map-context'
import Map, { Layer, Source } from 'react-map-gl/maplibre'
import MapControls from './map-controls'
import { useState, useEffect } from 'react'
import { ndvi } from '@/module/server'
import ee from '@google/earthengine'

const MapInner = () => {
  const { setMap, map } = useMapContext()

  // TODO: Global state management
  const [tile, setTile] = useState(null)
  const [startYear, setStartYear] = useState(2018)
  const [endYear, setEndYear] = useState(2023)
  const [visParams, setVisParams] = useState({
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
  })
  const [coordinates, setCoordinates] = useState([
    [120.61733763183594, 33.94630141529378],
    [132.43862669433594, 33.94630141529378],
    [132.43862669433594, 43.26378821701301],
    [120.61733763183594, 43.26378821701301],
    [120.61733763183594, 33.94630141529378],
  ])

  // Trigger server-side logic in response to client-side lifecycle events or state changes
  useEffect(() => {
    const loadTile = async () => {
      try {
        const { urlFormat } = await ndvi({ startYear, coordinates, visParams })
        console.log('Tile URL:', urlFormat)
        setTile([urlFormat])
      } catch (error) {
        console.error('Failed to load Landsat NDVI data:', error)
      }
    }

    // Only load if we don't already have a tile
    if (!tile) {
      loadTile()
    }
  }, [tile, startYear, endYear, coordinates, visParams])

  return (
    <div className="absolute overflow-hidden inset-0">
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
