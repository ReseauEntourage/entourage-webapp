import { LocationState } from './location.reducer'

interface AppState {
  location: LocationState;
}

export function selectLocation(state: AppState) {
  return state.location
}

export function selectLocationIsInit(state: AppState) {
  return state.location.isInit
}
