import ee from '@google/earthengine'

export type VisObject = {
  bands?: string[] | string
  min: number[] | number
  max: number[] | number
  palette?: string[] | string
}

export type MapId = {
  mapid: string
  urlFormat: string
  image: Object
}

// Authenticate Earth Engine using a service account
export function authenticate(): Promise<void> {
  if (!process.env.EE_KEY) {
    throw new Error('EE_KEY environment variable is required!')
  }

  // Private key for Google Earth Engine
  const privateKey = JSON.parse(process.env.EE_KEY)

  return new Promise((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(
      privateKey,
      () =>
        ee.initialize(
          null,
          null,
          () => resolve(),
          (error: string) => reject(new Error(error))
        ),
      (error: string) => reject(new Error(error))
    )
  })
}

// Get tile URL from ee object
// https://developers.google.com/earth-engine/apidocs/ee-imagecollection-getmapid?hl=ko
export function getMapId(
  data: ee.Image | ee.ImageCollection | ee.FeatureCollection | ee.Geometry,
  vis: VisObject | {}
): Promise<MapId> {
  return new Promise((resolve, reject) => {
    data.getMapId(vis, (object: MapId, error: string) =>
      error ? reject(new Error(error)) : resolve(object)
    )
  })
}
