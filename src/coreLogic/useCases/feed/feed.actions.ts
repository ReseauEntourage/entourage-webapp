import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { FeedState } from './feed.reducer'

export const ActionType = {
  SET_FILTERS: 'FEED/SET_FILTERS',
  RETRIEVE_FEED: 'FEED/RETRIEVE_FEED',
  RETRIEVE_FEED_SUCCESS: 'FEED/RETRIEVE_FEED_SUCCESS',
  RETRIEVE_FEED_NEXT_PAGE: 'FEED/RETRIEVE_FEED_NEXT_PAGE',
  RETRIEVE_FEED_NEXT_PAGE_SUCCESS: 'FEED/RETRIEVE_FEED_NEXT_PAGE_SUCCESS',
  UPDATE_ITEM: 'FEED/UPDATE_ITEM',
  SET_CURRENT_ITEM_UUID: 'FEED/SET_CURRENT_ITEM_UUID',
  JOIN_ENTOURAGE: 'FEED/JOIN_ENTOURAGE',
  JOIN_ENTOURAGE_SUCCEEDED: 'FEED/JOIN_ENTOURAGE_SUCCEEDED',
  LEAVE_ENTOURAGE: 'FEED/LEAVE_ENTOURAGE',
  LEAVE_ENTOURAGE_SUCCEEDED: 'FEED/LEAVE_ENTOURAGE_SUCCEEDED',
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

function retrieveFeedSuccess(
  payload: {
    items: FeedState['cacheItems'][number][];
    nextPageToken: FeedState['nextPageToken'];
  },
) {
  return {
    type: ActionType.RETRIEVE_FEED_SUCCESS,
    payload,
  }
}

function retrieveFeedNextPage() {
  return {
    type: ActionType.RETRIEVE_FEED_NEXT_PAGE,
  }
}

function retrieveFeedNextPageSuccess(
  payload: {
    items: FeedState['cacheItems'][number][];
    nextPageToken: FeedState['nextPageToken'];
  },
) {
  return {
    type: ActionType.RETRIEVE_FEED_NEXT_PAGE_SUCCESS,
    payload,
  }
}

function updateItem(payload: Partial<FeedState['cacheItems'][string]>) {
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

function joinEntourageSucceeded(payload: { entourageUuid: string; }) {
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

export const publicActions = {
  setFilters,
  retrieveFeed,
  retrieveFeedNextPage,
  updateItem,
  setCurrentItemUuid,
  joinEntourage,
  joinEntourageSucceeded,
  leaveEntourage,
  leaveEntourageSucceeded,
}

const privateActions = {
  retrieveFeedSuccess,
  retrieveFeedNextPageSuccess,
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type Actions = ActionsFromMapObject<typeof actions>
export type Action = ActionFromMapObject<typeof actions>