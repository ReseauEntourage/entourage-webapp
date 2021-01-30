import { uniqStringId } from 'src/utils/misc'
import { POIsState, POI, defaultPOIsState, POIDetails } from './pois.reducer'

export function createPOI() {
  return {
    uuid: uniqStringId(),
    name: 'POI Name',
    longitude: 12,
    latitude: 14,
    address: 'Rue de la Tour Eiffel',
    phone: '',
    categoryId: 63,
    partnerId: null,
  } as POI
}

export function createPOIList(): POI[] {
  return new Array(10).fill(null).map(() => createPOI())
}

export const fakePOIsData = {
  ...defaultPOIsState,
  fetching: false,
  filters: {
    cityName: 'New York',
    center: {
      lat: 0,
      lng: 0,
    },
    zoom: 12,
  },
  poisUuids: ['abc'],
  pois: {
    abc: {
      uuid: 'abc',
      name: 'POI Name',
      longitude: 12,
      latitude: 14,
      address: 'Rue de la Tour Eiffel',
      phone: '',
      categoryId: 63,
      partnerId: null,
    } as POI,
  },
  detailedPOIs: {},
  selectedItemUuid: null,
} as POIsState

export const createPOIDetails = () => {
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
  } as POIDetails
}
