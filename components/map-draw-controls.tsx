'use client'

import { useEffect, useRef } from 'react'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { useMapStore } from '@/store/map-store'
import useMapContext from '@/map/use-map-context'

const MapDrawControls = () => {
  const { map } = useMapContext()
  const { drawingMode, setCoordinates, setDrawingMode } = useMapStore()
  const drawRef = useRef<MapboxDraw | null>(null)

  useEffect(() => {
    if (!map) return
    console.log('Initializing MapBox Draw')

    let draw: MapboxDraw | null = null

    try {
      // Initialize MapboxDraw with custom styles including dashed lines
      draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {},
        styles: [
          // 참고: https://github.com/mapbox/mapbox-gl-draw/blob/578b817e2f8f71004d508b6e59a621e3a89b78f1/src/lib/theme.js#L2-L15

          // TODO: 추후 디자이너와 협업해서 수정
          // 그려지고 있는 중인 폴리곤 스타일
          // 선 - 파랑색 점선
          // 채우기 - 파랑색
          {
            id: 'gl-draw-polygon-stroke-drawing',
            type: 'line',
            filter: [
              'all',
              ['==', '$type', 'Polygon'],
              ['==', 'active', 'true'],
              ['!=', 'mode', 'static'],
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#0000ff', // Blue
              'line-width': 3,
              'line-dasharray': [4, 4],
            },
          },
          {
            id: 'gl-draw-polygon-fill-drawing',
            type: 'fill',
            filter: [
              'all',
              ['==', '$type', 'Polygon'],
              ['==', 'active', 'true'],
              ['!=', 'mode', 'static'],
            ],
            paint: {
              'fill-color': '#0000ff', // Blue
              'fill-opacity': 0.1,
            },
          },

          // TODO: 추후 디자이너와 협업해서 수정
          // 그리기 완료된 폴리곤 스타일
          // 선 - 초록색 실선
          // 채우기 - 초록색
          {
            id: 'gl-draw-polygon-stroke-inactive',
            type: 'line',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Polygon'],
              ['!=', 'mode', 'static'],
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#00ff00',
              'line-width': 2,
            },
          },
          {
            id: 'gl-draw-polygon-fill-inactive',
            type: 'fill',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Polygon'],
              ['!=', 'mode', 'static'],
            ],
            paint: {
              'fill-color': '#00ff00', // Green
              'fill-outline-color': '#00ff00',
              'fill-opacity': 0.1,
            },
          },

          // 다각형 편집모드에서 포인트 스타일
          {
            id: 'gl-draw-point-midpoint',
            type: 'circle',
            filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
            paint: {
              'circle-radius': 4,
              'circle-color': '#ff0000',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 1,
            },
          },

          // TODO: 추후 디자이너와 협업해서 수정
          // 그려지고 있는 포인트 스타일
          // 선 - 파랑색 실선
          // 채우기 - 하얀색
          {
            id: 'gl-draw-point-stroke-active',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['!=', 'meta', 'midpoint'],
              ['==', 'active', 'true'],
            ],
            paint: {
              'circle-radius': 7,
              'circle-color': '#0000ff',
            },
          },
          {
            id: 'gl-draw-point-active',
            type: 'circle',
            filter: [
              'all',
              ['==', '$type', 'Point'],
              ['!=', 'meta', 'midpoint'],
              ['==', 'active', 'true'],
            ],
            paint: {
              'circle-radius': 5,
              'circle-color': '#ffffff',
            },
          },

          // 그리기가 완료된 포인트 스타일
          // 선 - 노랑색 실선
          // 채우기 - 하얀색
          {
            id: 'gl-draw-point-point-stroke-inactive',
            type: 'circle',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Point'],
              ['==', 'meta', 'feature'],
              ['!=', 'mode', 'static'],
            ],
            paint: {
              'circle-radius': 7,
              'circle-color': '#ffff00',
            },
          },
          {
            id: 'gl-draw-point-inactive',
            type: 'circle',
            filter: [
              'all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Point'],
              ['==', 'meta', 'feature'],
              ['!=', 'mode', 'static'],
            ],
            paint: {
              'circle-radius': 5,
              'circle-color': '#ffffff',
            },
          },
        ],
      })

      drawRef.current = draw
      // @ts-ignore - MapboxDraw is compatible with MapLibre IControl

      // Add Mapbox Draw to map
      map.addControl(draw)
      console.log('MapBox Draw added to map successfully')

      // Event listeners for drawing completion
      const onDrawCreate = (e: any) => {
        const feature = e.features[0]
        if (feature && feature.geometry.type === 'Polygon') {
          // Convert polygon coordinates to our format
          const coords = feature.geometry.coordinates[0].map((coord: number[]) => [
            coord[0],
            coord[1],
          ])

          setCoordinates(coords)

          // Exit drawing mode after creating a shape
          setDrawingMode('none')
        }
      }

      map.on('draw.create', onDrawCreate)
    } catch (error) {
      console.error('Failed to initialize MapBox Draw:', error)
    }

    // Clean up
    return () => {
      if (map && drawRef.current) {
        try {
          // @ts-ignore - MapboxDraw is compatible with MapLibre IControl
          map.removeControl(drawRef.current)
        } catch (error) {
          console.log('Error removing draw control:', error)
        }
      }
    }
  }, [map, setCoordinates])

  useEffect(() => {
    if (!drawRef.current) return

    console.log('Drawing mode changed to:', drawingMode)
    const draw = drawRef.current

    try {
      switch (drawingMode) {
        case 'polygon':
          console.log('Starting polygon drawing mode')

          // Clear existing drawings first
          draw.deleteAll()

          // Start drawing polygon
          setTimeout(() => {
            if (drawRef.current && drawingMode === 'polygon') {
              drawRef.current.changeMode('draw_polygon')
            }
          }, 100)
          break

        case 'point':
          console.log('Starting point drawing mode')

          // Clear existing drawings first
          draw.deleteAll()

          // Start drawing point
          setTimeout(() => {
            if (drawRef.current && drawingMode === 'point') {
              drawRef.current.changeMode('draw_point')
            }
          }, 100)
          break

        case 'none':

        default:
          console.log('Exiting drawing mode')

          // Exit drawing mode
          draw.changeMode('simple_select')
          break
      }
    } catch (error) {
      console.error('Error changing draw mode:', error)
    }
  }, [drawingMode])

  // Escape key to exit drawing mode
  useEffect(() => {
    console.log('Setting up escape key listener, current drawing mode:', drawingMode)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawingMode !== 'none') {
        console.log('Escape key pressed, exiting drawing mode')
        setDrawingMode('none')
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [drawingMode, setDrawingMode])

  return null // This component doesn't render anything visible
}

export default MapDrawControls
