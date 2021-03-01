import { LocationState, defaultLocationState } from './location.reducer'

export const fakeLocationData: LocationState = {
  ...defaultLocationState,
  center: {
    lat: 0,
    lng: 0,
  },
  zoom: 12,
  displayAddress: 'Montmartre',
}
