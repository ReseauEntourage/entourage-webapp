import { FeedJoinStatus } from 'src/core/api'
import { ActionFromMapObject, ActionsFromMapObject, FilterEntourageType, FilterFeedCategory } from 'src/utils/types'
import { FeedState } from './feed.reducer'

export const FeedActionType = {
  INIT_FEED: 'FEED/INIT_FEED',
  CANCEL_FEED: 'FEED/CANCEL_FEED',
  RETRIEVE_FEED: 'FEED/RETRIEVE_FEED',
  RETRIEVE_FEED_STARTED: 'FEED/RETRIEVE_FEED_STARTED',
  RETRIEVE_FEED_SUCCEEDED: 'FEED/RETRIEVE_FEED_SUCCEEDED',
  RETRIEVE_FEED_NEXT_PAGE: 'FEED/RETRIEVE_FEED_NEXT_PAGE',
  RETRIEVE_FEED_NEXT_PAGE_STARTED: 'FEED/RETRIEVE_FEED_NEXT_PAGE_STARTED',
  RETRIEVE_FEED_NEXT_PAGE_SUCCEEDED: 'FEED/RETRIEVE_FEED_NEXT_PAGE_SUCCEEDED',
  UPDATE_ITEM: 'FEED/UPDATE_ITEM',
  SET_CURRENT_ITEM_UUID: 'FEED/SET_CURRENT_ITEM_UUID',
  INSERT_FEED_ITEM: 'FEED/INSERT_FEED_ITEM',
  REMOVE_CURRENT_ITEM_UUID: 'FEED/REMOVE_CURRENT_ITEM_UUID',
  JOIN_ENTOURAGE: 'FEED/JOIN_ENTOURAGE',
  JOIN_ENTOURAGE_SUCCEEDED: 'FEED/JOIN_ENTOURAGE_SUCCEEDED',
  LEAVE_ENTOURAGE: 'FEED/LEAVE_ENTOURAGE',
  LEAVE_ENTOURAGE_SUCCEEDED: 'FEED/LEAVE_ENTOURAGE_SUCCEEDED',
  CLOSE_ENTOURAGE: 'FEED/CLOSE_ENTOURAGE',
  CLOSE_ENTOURAGE_SUCCEEDED: 'FEED/CLOSE_ENTOURAGE_SUCCEEDED',
  REOPEN_ENTOURAGE: 'FEED/REOPEN_ENTOURAGE',
  REOPEN_ENTOURAGE_SUCCEEDED: 'FEED/REOPEN_ENTOURAGE_SUCCEEDED',
  TOGGLE_ACTION_TYPES_FILTER: 'FEED/TOGGLE_ACTION_TYPES_FILTER',
  TOGGLE_EVENTS_FILTER: 'FEED/TOGGLE_EVENTS_FILTER',
  SET_TIME_RANGE_FILTER: 'FEED/SET_TIME_RANGE_FILTER',
} as const

export type FeedActionType = keyof typeof FeedActionType;

// ------------------------------------------------------------------------

function init() {
  return {
    type: FeedActionType.INIT_FEED,
  }
}

function cancel() {
  return {
    type: FeedActionType.CANCEL_FEED,
  }
}

function retrieveFeed() {
  return {
    type: FeedActionType.RETRIEVE_FEED,
  }
}

function retrieveFeedStarted() {
  return {
    type: FeedActionType.RETRIEVE_FEED_STARTED,
  }
}

function retrieveFeedSuccess(
  payload: {
    items: FeedState['items'][number][];
    nextPageToken: FeedState['nextPageToken'];
  },
) {
  return {
    type: FeedActionType.RETRIEVE_FEED_SUCCEEDED,
    payload,
  }
}

function retrieveFeedNextPage() {
  return {
    type: FeedActionType.RETRIEVE_FEED_NEXT_PAGE,
  }
}

function retrieveFeedNextPageStarted() {
  return {
    type: FeedActionType.RETRIEVE_FEED_NEXT_PAGE_STARTED,
  }
}

function retrieveFeedNextPageSuccess(
  payload: {
    items: FeedState['items'][number][];
    nextPageToken: FeedState['nextPageToken'];
  },
) {
  return {
    type: FeedActionType.RETRIEVE_FEED_NEXT_PAGE_SUCCEEDED,
    payload,
  }
}

function updateItem(payload: Partial<FeedState['items'][string]>) {
  return {
    type: FeedActionType.UPDATE_ITEM,
    payload,
  }
}

function setCurrentFeedItemUuid(payload: string | null) {
  return {
    type: FeedActionType.SET_CURRENT_ITEM_UUID,
    payload,
  }
}

function insertFeedItem(payload: FeedState['items'][string]) {
  return {
    type: FeedActionType.INSERT_FEED_ITEM,
    payload,
  }
}

function removeCurrentFeedItemUuid() {
  return {
    type: FeedActionType.REMOVE_CURRENT_ITEM_UUID,
  }
}

function joinEntourage(payload: { entourageUuid: string; }) {
  return {
    type: FeedActionType.JOIN_ENTOURAGE,
    payload,
  }
}

function joinEntourageSucceeded(payload: { entourageUuid: string; status: FeedJoinStatus; }) {
  return {
    type: FeedActionType.JOIN_ENTOURAGE_SUCCEEDED,
    payload,
  }
}

function leaveEntourage(payload: { entourageUuid: string; userId: number; }) {
  return {
    type: FeedActionType.LEAVE_ENTOURAGE,
    payload,
  }
}

function leaveEntourageSucceeded(payload: { entourageUuid: string; }) {
  return {
    type: FeedActionType.LEAVE_ENTOURAGE_SUCCEEDED,
    payload,
  }
}

function closeEntourage(payload: { entourageUuid: string; success: boolean; }) {
  return {
    type: FeedActionType.CLOSE_ENTOURAGE,
    payload,
  }
}

function closeEntourageSucceeded(payload: { entourageUuid: string; }) {
  return {
    type: FeedActionType.CLOSE_ENTOURAGE_SUCCEEDED,
    payload,
  }
}

function reopenEntourage(payload: { entourageUuid: string; }) {
  return {
    type: FeedActionType.REOPEN_ENTOURAGE,
    payload,
  }
}

function reopenEntourageSucceeded(payload: { entourageUuid: string; }) {
  return {
    type: FeedActionType.REOPEN_ENTOURAGE_SUCCEEDED,
    payload,
  }
}

function toggleActionTypesFilter(payload: { type: FilterEntourageType; category?: FilterFeedCategory;}) {
  return {
    type: FeedActionType.TOGGLE_ACTION_TYPES_FILTER,
    payload,
  }
}

function toggleEventsFilter() {
  return {
    type: FeedActionType.TOGGLE_EVENTS_FILTER,
  }
}

function setTimeRangeFilter(payload: number) {
  return {
    type: FeedActionType.SET_TIME_RANGE_FILTER,
    payload,
  }
}

// --------------------------------------------------------------------------------

export const publicActions = {
  init,
  cancel,
  retrieveFeed,
  retrieveFeedNextPageStarted,
  retrieveFeedNextPage,
  updateItem,
  setCurrentFeedItemUuid,
  joinEntourage,
  leaveEntourage,
  closeEntourage,
  reopenEntourage,
  removeCurrentFeedItemUuid,
  toggleActionTypesFilter,
  toggleEventsFilter,
  setTimeRangeFilter,
}

const privateActions = {
  retrieveFeedStarted,
  retrieveFeedSuccess,
  insertFeedItem,
  retrieveFeedNextPageSuccess,
  joinEntourageSucceeded,
  leaveEntourageSucceeded,
  closeEntourageSucceeded,
  reopenEntourageSucceeded,
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type FeedActions = ActionsFromMapObject<typeof actions>
export type FeedAction = ActionFromMapObject<typeof actions>
