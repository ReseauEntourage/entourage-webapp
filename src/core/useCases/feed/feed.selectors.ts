import { selectEntitiesFromRequest } from '../entities'
import { AppState } from '../reducers'
import { FeedStatus } from 'src/core/api'
import { assertCondition } from 'src/utils/misc'
import { JoinRequestStatus, RequestStatus } from './feed.reducer'

export function selectFeedIsIdle(state: AppState) {
  return state.feed.isIdle
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
  return selectEntitiesFromRequest(state, state.feed.itemsUuids, '/feeds GET')
    .feeds
    .map(((item) => {
      assertCondition(item.type === 'Entourage')
      return item.data
    }))
}

export function selectHasNextPageToken(state: AppState) {
  return !!state.feed.nextPageToken
}

export function selectCurrentItem(state: AppState) {
  const { selectedItemUuid } = state.feed

  if (!selectedItemUuid) return null

  return selectEntitiesFromRequest(state, [selectedItemUuid], '/feeds GET')
    .feeds
    .filter(Boolean)
    .map(((item) => {
      assertCondition(item.type === 'Entourage')
      return item.data
    }))
    .find((item) => item.uuid === selectedItemUuid)
}

export function selectIsUpdatingJoinStatus(state: AppState) {
  return state.feed.isUpdatingJoinStatus
}

export function selectJoinRequestStatus(state: AppState, entourageUuid: string) {
  const entourage = state.entities.entourages[entourageUuid]

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
  const entourage = state.entities.entourages[entourageUuid]
  return MapFeedStatusToRequestStatus[entourage.status]
}
