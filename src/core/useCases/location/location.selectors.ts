import { LocationState } from './location.reducer'

interface AppState {
  location: LocationState;
}

export function selectLocation(state: AppState) {
  return state.location
}

export function selectPosition(state: AppState) {
  return state.location.position
}
