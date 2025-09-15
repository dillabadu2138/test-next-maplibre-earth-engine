'use server'

import ee from '@google/earthengine'
import { authenticate, getMapId, VisObject, MapId } from './ee'

// Define a function to mask unwanted pixels
function maskL8sr(col) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = 1 << 3
  var cloudsBitMask = 1 << 5
  // Get the pixel QA band.
  var qa = col.select('QA_PIXEL')
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0).and(qa.bitwiseAnd(cloudsBitMask).eq(0))
  return col.updateMask(mask)
}

export async function ndvi(body: {
  startYear: number
  coordinates: number[][]
  visParams: VisObject
}) {
  // First, authenticate
  await authenticate()

  const { startYear, coordinates, visParams } = body

  // Area of Interest
  const aoi = ee.Geometry.Polygon(coordinates)

  const start_date = ee.Date(`${startYear}-01-01`)

  // Load a Landsat 8 collection
  // https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_L2#description
  const collection: ee.ImageCollection = ee
    .ImageCollection('LANDSAT/LC08/C02/T1_L2')
    // Mask unwanted pixels
    .map(maskL8sr)
    // Filter an image collection to include only relevant data
    // 앞으로 두 달 뒤로 두 달
    .filterDate(start_date.advance(-2, 'month'), start_date.advance(2, 'month'))
    .filterBounds(aoi)
    // Clip to region
    .map(function (image) {
      return image.clip(aoi)
    })

  // Compute a median image
  const image = collection.median()

  // Create an NDVI image
  // Normalized difference vegetation index
  const ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')

  //
  const { urlFormat }: MapId = await getMapId(ndvi, visParams)
  console.log(urlFormat)

  return { urlFormat }
}
