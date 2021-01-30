import { FeedStatus } from 'src/core/api'
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

export function selectFeedItems(state: AppState) {
  return state.feed.itemsUuids.map((itemUuid) => {
    return state.feed.items[itemUuid]
  })
}

export function selectHasNextPageToken(state: AppState) {
  return !!state.feed.nextPageToken
}

export function selectCurrentItem(state: AppState) {
  const { selectedItemUuid, items } = state.feed

  return selectedItemUuid ? items[selectedItemUuid] : null
}

export function selectIsUpdatingJoinStatus(state: AppState) {
  return state.feed.isUpdatingJoinStatus
}

export function selectJoinRequestStatus(state: AppState, entourageUuid: string) {
  const entourage = state.feed.items[entourageUuid]

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

const MapFeedStatusToRequestStatus: Record<FeedStatus, RequestStatus> = {
  closed: RequestStatus.CLOSED,
  open: RequestStatus.OPEN,
  suspended: RequestStatus.SUSPENDED,
}

export function selectStatus(state: AppState, entourageUuid: string) {
  const entourage = state.feed.items[entourageUuid]
  return MapFeedStatusToRequestStatus[entourage.status]
}
