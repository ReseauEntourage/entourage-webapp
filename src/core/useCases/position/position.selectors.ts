import { PositionState } from './position.reducer'

interface AppState {
  position: PositionState;
}

export function selectPosition(state: AppState) {
  return state.position.position
}
