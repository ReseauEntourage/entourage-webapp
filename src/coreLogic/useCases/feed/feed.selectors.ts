import { JoinRequestStatus, FeedState } from './feed.reducer'

interface AppState {
  feed: FeedState;
}

export function selectFeed(state: AppState) {
  return state.feed
}

export function selectFeedFilters(state: AppState) {
  return state.feed.filters
}

export function selectFeedIsFetching(state: AppState) {
  return state.feed.fetching
}

export function selectFeedItems(state: AppState) {
  return state.feed.items.map((itemUuid) => {
    return state.feed.cacheItems[itemUuid]
  })
}

export function selectHasNextPageToken(state: AppState) {
  return !!state.feed.nextPageToken
}

export function selectCurrentItem(state: AppState) {
  const { selectedItemUuid, cacheItems } = state.feed

  return selectedItemUuid ? cacheItems[selectedItemUuid] : null
}

export function selectIsUpdatingJoinStatus(state: AppState) {
  return state.feed.isUpdatingJoinStatus
}

export function selectJoinRequestStatus(state: AppState, entourageUuid: string) {
  const entourage = state.feed.cacheItems[entourageUuid]

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
