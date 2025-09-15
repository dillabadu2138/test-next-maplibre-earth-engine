import { GeolocateControl, FullscreenControl, NavigationControl } from 'react-map-gl/maplibre'

const MapControls = () => {
  return (
    <>
      <GeolocateControl position="top-right" />
      <FullscreenControl position="top-right" />
      <NavigationControl position="top-right" />
    </>
  )
}

export default MapControls
