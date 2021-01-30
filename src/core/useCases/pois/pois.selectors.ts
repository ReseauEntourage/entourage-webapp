import { POIsState } from './pois.reducer'

interface AppState {
  pois: POIsState;
}

export function selectPOIsIsIdle(state: AppState) {
  return state.pois.isIdle
}

export function selectPOIs(state: AppState) {
  return state.pois
}

export function selectPOIsIsFetching(state: AppState) {
  return state.pois.fetching
}

export function selectPOIDetailsIsFetching(state: AppState) {
  return state.pois.detailsFetching
}

export function selectPOIList(state: AppState) {
  return state.pois.poisUuids.map((poiId) => {
    return state.pois.pois[poiId]
  })
}

export function selectCurrentPOI(state: AppState) {
  const { selectedPOIUuid, detailedPOIs } = state.pois

  return selectedPOIUuid ? detailedPOIs[selectedPOIUuid] : null
}
