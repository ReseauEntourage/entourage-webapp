import { createSelector } from 'reselect'

import { FeedStatus } from 'src/core/api'
import { assertCondition } from 'src/utils/misc'
import { FilterEntourageType, FilterFeedCategory } from 'src/utils/types'
import { JoinRequestStatus, FeedState, RequestStatus } from './feed.reducer'

interface AppState {
  feed: FeedState;
}

export function selectFeedIsIdle(state: AppState) {
  return state.feed.isIdle
}

export function selectFeed(state: AppState) {
  return state.feed
}

export function selectFeedIsFetching(state: AppState) {
  return state.feed.fetching
}

export const selectFeedItems = createSelector(
  (state: AppState) => state.feed.itemsUuids,
  (state: AppState) => state.feed.items,
  (itemsUuids: FeedState['itemsUuids'], items: FeedState['items']) => itemsUuids.map((itemUuid) => {
    return items[itemUuid]
  }),
)

export function selectHasNextPageToken(state: AppState) {
  return !!state.feed.nextPageToken
}

export function selectCurrentFeedItemUuid(state: AppState) {
  return state.feed.selectedItemUuid
}

export function selectCurrentFeedItem(state: AppState) {
  const { selectedItemUuid, items } = state.feed

  return selectedItemUuid ? items[selectedItemUuid] : null
}

export function selectIsUpdatingJoinStatus(state: AppState) {
  return state.feed.isUpdatingJoinStatus
}

export function selectJoinRequestStatus(state: AppState, entourageUuid: string) {
  const entourage = state.feed.items[entourageUuid]
  assertCondition(entourage.itemType === 'Entourage')

  switch (entourage.joinStatus) {
    case 'cancelled':
    case 'not_requested':
      return JoinRequestStatus.NOT_REQUEST
    case 'pending':
      return JoinRequestStatus.PENDING
    case 'accepted':
      return JoinRequestStatus.ACCEPTED
    default:
      console.warn(`join status ${entourage.joinStatus} is not handled`)
      return null
  }
}

export function selectIsUpdatingStatus(state: AppState) {
  return state.feed.isUpdatingStatus
}

export function selectActionTypesFilters(state: AppState) {
  return state.feed.filters.actionTypes
}

export function selectIsActiveActionTypesFilter(
  state: AppState,
  type: FilterEntourageType,
  category?: FilterFeedCategory,
) {
  if (category) {
    return state.feed.filters.actionTypes[type].includes(category)
  }
  return state.feed.filters.actionTypes[type].length > 0
}

export function selectIsActiveEventsFilter(state: AppState) {
  return state.feed.filters.events
}

export function selectTimeRangeFilter(state: AppState) {
  return state.feed.filters.timeRange
}

const MapFeedStatusToRequestStatus: Record<FeedStatus, RequestStatus> = {
  closed: RequestStatus.CLOSED,
  open: RequestStatus.OPEN,
  suspended: RequestStatus.SUSPENDED,
}

export function selectStatus(state: AppState, entourageUuid: string) {
  const entourage = state.feed.items[entourageUuid]
  assertCondition(entourage.itemType === 'Entourage')
  return MapFeedStatusToRequestStatus[entourage.status]
}
