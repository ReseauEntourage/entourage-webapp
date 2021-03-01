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

export const fakePOIsData = {
  ...defaultPOIsState,
  fetching: false,
  filters: {
    displayAddress: 'New York',
    center: {
      lat: 0,
      lng: 0,
    },
    zoom: 12,
  },
  poisUuids: ['abc'],
  pois: {
    abc: createPOI(),
  },
  detailedPOIs: {},
  selectedItemUuid: null,
} as POIsState

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
