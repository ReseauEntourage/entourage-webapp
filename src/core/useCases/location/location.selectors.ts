import { LocationState } from './location.reducer'

interface AppState {
  location: LocationState;
}

export function selectLocation(state: AppState) {
  const { geolocation, isInit, mapPosition, ...restLocation } = state.location
  return restLocation
}

export function selectGeolocation(state: AppState) {
  return state.location.geolocation
}

export function selectLocationIsInit(state: AppState) {
  return state.location.isInit
}

export function selectMapHasMoved(state: AppState) {
  return (
    state.location.center.lat !== state.location.mapPosition.center.lat
    || state.location.center.lng !== state.location.mapPosition.center.lng
    || state.location.zoom !== state.location.mapPosition.zoom
  )
}

export function selectMapPosition(state: AppState) {
  return state.location.mapPosition
}

