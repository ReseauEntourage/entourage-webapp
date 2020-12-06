import produce from 'immer'
import { constants } from 'src/constants'
import {
  FeedMetadata,
  FeedDisplayCategory,
  FeedGroupType,
  UserPartner,
  FeedEntourageType, FeedJoinStatus,
} from 'src/core/api'
import { Action, ActionType } from './feed.actions'

export const JoinRequestStatus = {
  NOT_REQUEST: 'NOT_REQUEST',
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
} as const

export type JoinRequestStatus = keyof typeof JoinRequestStatus

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
  items: string[];
  cacheItems: {
    [itemUuid: string]: FeedItem;
  };
  nextPageToken: string | null;
  selectedItemUuid: string | null;
  isUpdatingJoinStatus: boolean;
  isIdle: boolean;
}

export const defaultFeedState: FeedState = {
  fetching: false,
  items: [],
  filters: {
    cityName: constants.DEFAULT_LOCATION.CITY_NAME,
    center: constants.DEFAULT_LOCATION.CENTER,
    zoom: constants.DEFAULT_LOCATION.ZOOM,
  },
  nextPageToken: null,
  cacheItems: {},
  selectedItemUuid: null,
  isUpdatingJoinStatus: false,
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

    case ActionType.RETRIEVE_FEED_STARTED: {
      return {
        ...state,
        fetching: true,
      }
    }

    case ActionType.RETRIEVE_FEED_SUCCEEDED: {
      return {
        ...state,
        isIdle: false,
        cacheItems: action.payload.items.reduce(
          (acc: FeedState['cacheItems'], item: FeedState['cacheItems'][number]) => {
            return {
              ...acc,
              [item.uuid]: item,
            }
          }, state.cacheItems,
        ),
        items: action.payload.items.map((item) => item.uuid),
        nextPageToken: action.payload.nextPageToken,
        fetching: false,
      }
    }

    case ActionType.RETRIEVE_FEED_NEXT_PAGE_SUCCEEDED: {
      return {
        ...state,
        cacheItems: action.payload.items.reduce(
          (acc: FeedState['cacheItems'], item: FeedState['cacheItems'][number]) => {
            return {
              ...acc,
              [item.uuid]: item,
            }
          }, state.cacheItems,
        ),
        items: [
          ...state.items,
          ...action.payload.items.map((item) => item.uuid),
        ],
        nextPageToken: action.payload.nextPageToken,
        fetching: false,
      }
    }

    case ActionType.UPDATE_ITEM: {
      return produce(state, (draftState) => {
        const { uuid } = action.payload
        if (!uuid) {
          throw new Error('UUID is required for item update')
        }

        const item = draftState.cacheItems[uuid]

        if (!item) {
          throw new Error(`item with uuid ${uuid} is not defined`)
        }

        // eslint-disable-next-line
        draftState.cacheItems[uuid] = {
          ...item,
          ...action.payload,
        }
      })
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
        cacheItems: produce(state.cacheItems, (cachedItems) => {
          const item = cachedItems[action.payload.entourageUuid]
          item.joinStatus = action.payload.status
        }),
      }
    }

    case ActionType.LEAVE_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        isUpdatingJoinStatus: false,
        cacheItems: produce(state.cacheItems, (cachedItems) => {
          const item = cachedItems[action.payload.entourageUuid]
          item.joinStatus = 'not_requested'
        }),
      }
    }

    default:
      return state
  }

  return state
}
