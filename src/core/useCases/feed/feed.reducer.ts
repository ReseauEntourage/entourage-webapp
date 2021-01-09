import { constants } from 'src/constants'
import {
  FeedMetadata,
  FeedDisplayCategory,
  FeedGroupType,
  UserPartner,
  FeedEntourageType,
  FeedJoinStatus,
  FeedStatus,
} from 'src/core/api'
import { Action, ActionType } from './feed.actions'

export const JoinRequestStatus = {
  NOT_REQUEST: 'NOT_REQUEST',
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
} as const

export type JoinRequestStatus = keyof typeof JoinRequestStatus

export const RequestStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  SUSPENDED: 'SUSPENDED',
} as const

export type RequestStatus = keyof typeof RequestStatus

export interface FeedItem {
  author: {
    id: number;
    avatarUrl?: string;
    displayName: string;
    partner: UserPartner | null;
  };
  createdAt: string;
  updatedAt: string;
  description: string;
  id: number;
  uuid: string;
  title: string;
  location: {
    latitude: number;
    longitude: number;
  };
  metadata: FeedMetadata;
  displayCategory: FeedDisplayCategory;
  entourageType: FeedEntourageType;
  groupType: FeedGroupType;
  joinStatus: FeedJoinStatus;
  status: FeedStatus;
}

export interface FeedState {
  fetching: boolean;
  filters: {
    cityName: string;
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
  };
  itemsUuids: string[];
  // items: {
  //   [itemUuid: string]: FeedItem;
  // };
  nextPageToken: string | null;
  selectedItemUuid: string | null;
  isUpdatingJoinStatus: boolean;
  isUpdatingStatus: boolean;
  isIdle: boolean;
}

export const defaultFeedState: FeedState = {
  fetching: false,
  itemsUuids: [],
  filters: {
    cityName: constants.DEFAULT_LOCATION.CITY_NAME,
    center: constants.DEFAULT_LOCATION.CENTER,
    zoom: constants.DEFAULT_LOCATION.ZOOM,
  },
  nextPageToken: null,
  // items: {},
  selectedItemUuid: null,
  isUpdatingJoinStatus: false,
  isUpdatingStatus: false,
  isIdle: true,
}

export function feedReducer(state: FeedState = defaultFeedState, action: Action): FeedState {
  switch (action.type) {
    case ActionType.SET_FILTERS: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
        nextPageToken: null,
      }
    }

    case ActionType.RETRIEVE_FEED_STARTED:
    case ActionType.RETRIEVE_FEED_NEXT_PAGE_STARTED: {
      return {
        ...state,
        fetching: true,
      }
    }

    case ActionType.RETRIEVE_FEED_SUCCEEDED: {
      return {
        ...state,
        isIdle: false,
        itemsUuids: action.payload.itemsUuids,
        nextPageToken: action.payload.nextPageToken,
        fetching: false,
      }
    }

    case ActionType.RETRIEVE_FEED_NEXT_PAGE_SUCCEEDED: {
      return {
        ...state,
        itemsUuids: [
          ...state.itemsUuids,
          ...action.payload.itemsUuids,
        ],
        nextPageToken: action.payload.nextPageToken,
        fetching: false,
      }
    }

    case ActionType.SET_CURRENT_ITEM_UUID: {
      return {
        ...state,
        selectedItemUuid: action.payload,
      }
    }

    case ActionType.JOIN_ENTOURAGE:
    case ActionType.LEAVE_ENTOURAGE: {
      return {
        ...state,
        isUpdatingJoinStatus: true,
      }
    }

    case ActionType.JOIN_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        isUpdatingJoinStatus: false,
      }
    }

    case ActionType.LEAVE_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        isUpdatingJoinStatus: false,
      }
    }

    case ActionType.REOPEN_ENTOURAGE:
    case ActionType.CLOSE_ENTOURAGE: {
      return {
        ...state,
        isUpdatingStatus: true,
      }
    }

    case ActionType.CLOSE_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        isUpdatingStatus: false,
      }
    }

    case ActionType.REOPEN_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        isUpdatingStatus: false,
      }
    }

    default:
      return state
  }

  return state
}
