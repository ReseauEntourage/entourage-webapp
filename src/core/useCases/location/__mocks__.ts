import { LocationState, defaultLocationState } from './location.reducer'

export const fakeLocationData = {
  ...defaultLocationState,
  position: {
    center: {
      lat: 0,
      lng: 0,
    },
    zoom: 12,
  },
} as LocationState
