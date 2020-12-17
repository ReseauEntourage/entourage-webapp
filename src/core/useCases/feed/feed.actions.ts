import { FeedJoinStatus } from 'src/core/api'
import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { FeedState } from './feed.reducer'

export const ActionType = {
  SET_FILTERS: 'FEED/SET_FILTERS',
  RETRIEVE_FEED: 'FEED/RETRIEVE_FEED',
  RETRIEVE_FEED_STARTED: 'FEED/RETRIEVE_FEED_STARTED',
  RETRIEVE_FEED_SUCCEEDED: 'FEED/RETRIEVE_FEED_SUCCEEDED',
  RETRIEVE_FEED_NEXT_PAGE: 'FEED/RETRIEVE_FEED_NEXT_PAGE',
  RETRIEVE_FEED_NEXT_PAGE_STARTED: 'FEED/RETRIEVE_FEED_NEXT_PAGE_STARTED',
  RETRIEVE_FEED_NEXT_PAGE_SUCCEEDED: 'FEED/RETRIEVE_FEED_NEXT_PAGE_SUCCEEDED',
  UPDATE_ITEM: 'FEED/UPDATE_ITEM',
  SET_CURRENT_ITEM_UUID: 'FEED/SET_CURRENT_ITEM_UUID',
  JOIN_ENTOURAGE: 'FEED/JOIN_ENTOURAGE',
  JOIN_ENTOURAGE_SUCCEEDED: 'FEED/JOIN_ENTOURAGE_SUCCEEDED',
  LEAVE_ENTOURAGE: 'FEED/LEAVE_ENTOURAGE',
  LEAVE_ENTOURAGE_SUCCEEDED: 'FEED/LEAVE_ENTOURAGE_SUCCEEDED',
  CLOSE_ENTOURAGE: 'FEED/CLOSE_ENTOURAGE',
  CLOSE_ENTOURAGE_SUCCEEDED: 'FEED/CLOSE_ENTOURAGE_SUCCEEDED',
  REOPEN_ENTOURAGE: 'FEED/REOPEN_ENTOURAGE',
  REOPEN_ENTOURAGE_SUCCEEDED: 'FEED/REOPEN_ENTOURAGE_SUCCEEDED',
} as const

export type ActionType = keyof typeof ActionType;

// ------------------------------------------------------------------------

function setFilters(payload: Partial<FeedState['filters']>) {
  return {
    type: ActionType.SET_FILTERS,
    payload,
  }
}

function retrieveFeed(payload?: Pick<FeedState, 'filters' | 'nextPageToken'>) {
  return {
    type: ActionType.RETRIEVE_FEED,
    payload,
  }
}

function retrieveFeedStarted() {
  return {
    type: ActionType.RETRIEVE_FEED_STARTED,
  }
}

function retrieveFeedSuccess(
  payload: {
    items: FeedState['items'][number][];
    nextPageToken: FeedState['nextPageToken'];
  },
) {
  return {
    type: ActionType.RETRIEVE_FEED_SUCCEEDED,
    payload,
  }
}

function retrieveFeedNextPage() {
  return {
    type: ActionType.RETRIEVE_FEED_NEXT_PAGE,
  }
}

function retrieveFeedNextPageStarted() {
  return {
    type: ActionType.RETRIEVE_FEED_NEXT_PAGE_STARTED,
  }
}

function retrieveFeedNextPageSuccess(
  payload: {
    items: FeedState['items'][number][];
    nextPageToken: FeedState['nextPageToken'];
  },
) {
  return {
    type: ActionType.RETRIEVE_FEED_NEXT_PAGE_SUCCEEDED,
    payload,
  }
}

function updateItem(payload: Partial<FeedState['items'][string]>) {
  return {
    type: ActionType.UPDATE_ITEM,
    payload,
  }
}

function setCurrentItemUuid(payload: string | null) {
  return {
    type: ActionType.SET_CURRENT_ITEM_UUID,
    payload,
  }
}

function joinEntourage(payload: { entourageUuid: string; }) {
  return {
    type: ActionType.JOIN_ENTOURAGE,
    payload,
  }
}

function joinEntourageSucceeded(payload: { entourageUuid: string; status: FeedJoinStatus; }) {
  return {
    type: ActionType.JOIN_ENTOURAGE_SUCCEEDED,
    payload,
  }
}

function leaveEntourage(payload: { entourageUuid: string; userId: number; }) {
  return {
    type: ActionType.LEAVE_ENTOURAGE,
    payload,
  }
}

function leaveEntourageSucceeded(payload: { entourageUuid: string; }) {
  return {
    type: ActionType.LEAVE_ENTOURAGE_SUCCEEDED,
    payload,
  }
}

function closeEntourage(payload: { entourageUuid: string; success: boolean; }) {
  return {
    type: ActionType.CLOSE_ENTOURAGE,
    payload,
  }
}

function closeEntourageSucceeded(payload: { entourageUuid: string; }) {
  return {
    type: ActionType.CLOSE_ENTOURAGE_SUCCEEDED,
    payload,
  }
}

function reopenEntourage(payload: { entourageUuid: string; }) {
  return {
    type: ActionType.REOPEN_ENTOURAGE,
    payload,
  }
}

function reopenEntourageSucceeded(payload: { entourageUuid: string; }) {
  return {
    type: ActionType.REOPEN_ENTOURAGE_SUCCEEDED,
    payload,
  }
}

// --------------------------------------------------------------------------------

export const publicActions = {
  setFilters,
  retrieveFeed,
  retrieveFeedNextPageStarted,
  retrieveFeedNextPage,
  updateItem,
  setCurrentItemUuid,
  joinEntourage,
  leaveEntourage,
  closeEntourage,
  reopenEntourage,
}

const privateActions = {
  retrieveFeedStarted,
  retrieveFeedSuccess,
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

export type Actions = ActionsFromMapObject<typeof actions>
export type Action = ActionFromMapObject<typeof actions>
