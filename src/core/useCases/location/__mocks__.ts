import { LocationState } from './location.reducer'

export const fakeLocationData: Pick<LocationState, 'center' |'zoom' | 'displayAddress'> = {
  center: {
    lat: 0,
    lng: 0,
  },
  zoom: 12,
  displayAddress: 'Montmartre',
}
