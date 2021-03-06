import { createSelector } from 'reselect'
import { FilterPOICategory, FilterPOIPartner } from 'src/utils/types'
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

export const selectPOIList = createSelector(
  (state: AppState) => state.pois.poisUuids,
  (state: AppState) => state.pois.pois,
  (poisUuids, pois) => poisUuids.map((poiId) => {
    return pois[poiId]
  }),
)

export function selectCurrentPOIUuid(state: AppState) {
  return state.pois.selectedPOIUuid
}

export function selectCurrentPOI(state: AppState) {
  const { selectedPOIUuid, detailedPOIs } = state.pois

  return selectedPOIUuid ? detailedPOIs[selectedPOIUuid] : null
}

export function selectPOIsFilters(state: AppState) {
  return state.pois.filters
}

export function selectIsActiveFilter(state: AppState, category: FilterPOICategory, partner?: FilterPOIPartner) {
  if (partner && category === FilterPOICategory.PARTNERS) {
    return state.pois.filters.partners.includes(partner)
  }

  return state.pois.filters.categories.includes(category)
}

export function selectAreFiltersDisabled(state: AppState) {
  return state.pois.filters.categories.length === 0
}

