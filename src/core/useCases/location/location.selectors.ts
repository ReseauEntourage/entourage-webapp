import { LocationState } from './location.reducer'

interface AppState {
  location: LocationState;
}

export function selectLocation(state: AppState) {
  const { geolocation, ...restLocation } = state.location
  const { isInit, ...restPosition } = restLocation
  return restPosition
}

export function selectGeolocation(state: AppState) {
  return state.location.geolocation
}

export function selectLocationIsInit(state: AppState) {
  return state.location.isInit
}
