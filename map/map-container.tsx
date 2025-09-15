'use client'

import MapContextProvider from '@/map/map-context-provider'
import useMapContext from './useMapContext'
import Map from 'react-map-gl/maplibre'
import MapControls from './map-controls'

const MapInner = () => {
  const { setMap, map } = useMapContext()

  return (
    <div className="absolute overflow-hidden inset-0">
      <Map
        ref={(e) => setMap && setMap(e || undefined)}
        initialViewState={{ longitude: 127, latitude: 35, zoom: 2 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        projection="globe"
      >
        <MapControls />
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
