import { RequestResponse } from 'src/api'
import { SchemaRelation } from '../types'
import { getId } from '../utils'

export function fetchResolver(payload: RequestResponse<'GET pois'>) {
  const POIs = payload.pois.map((poi) => ({
    description: poi.description,
    id: getId(poi),
    latitude: poi.latitude,
    longitude: poi.longitude,
    category: poi.category,
  }))

  return POIs
}

export type ResourceList = ReturnType<typeof fetchResolver>
export type Resource = ResourceList[0]

export const relations: SchemaRelation = {}
