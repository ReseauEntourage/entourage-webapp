import { PositionState, defaultPositionState } from './position.reducer'

export const fakePositionData = {
  ...defaultPositionState,
  position: {
    center: {
      lat: 0,
      lng: 0,
    },
    zoom: 12,
  },
} as PositionState
