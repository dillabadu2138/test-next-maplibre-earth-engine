'use client'

import { useContext } from 'react'

import { MapContext } from '@/map/map-context-provider'

const useMapContext = () => {
  const mapInstance = useContext(MapContext)

  if (!mapInstance) {
    throw new Error('useMapContext must be used within a MapContextProvider!')
  }

  const map = mapInstance?.map
  const setMap = mapInstance?.setMap

  return { map, setMap }
}

export default useMapContext
