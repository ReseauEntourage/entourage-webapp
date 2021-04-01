import { uniqStringId } from 'src/utils/misc'
import { POIsState, POI, defaultPOIsState, POIDetails } from './pois.reducer'

export function createPOI(): POI {
  return {
    uuid: uniqStringId(),
    name: 'POI Name',
    longitude: 12,
    latitude: 14,
    address: 'Rue de la Tour Eiffel',
    phone: '',
    categoryId: 63,
    partnerId: null,
  }
}

export function createPOIList(): POI[] {
  return new Array(10).fill(null).map(() => createPOI())
}

export const fakePOIsData: POIsState = {
  ...defaultPOIsState,
  fetching: false,
  poisUuids: ['abc'],
  pois: {
    abc: createPOI(),
  },
  detailedPOIs: {},
  selectedPOIUuid: null,
}

export function createPOIDetails(): POIDetails {
  return {
    uuid: uniqStringId(),
    name: 'POI Name',
    longitude: 12,
    latitude: 14,
    address: 'Rue de la Tour Eiffel',
    phone: '',
    partnerId: null,
    description: '',
    categoryIds: [1],
    website: '',
    email: '',
    hours: '',
    languages: '',
    audience: '',
    source: 'entourage',
    sourceUrl: null,
  }
}
