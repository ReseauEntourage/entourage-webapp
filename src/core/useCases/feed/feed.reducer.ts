import produce from 'immer'
import { LocationAction, LocationActionType } from '../location/location.actions'
import { POIsActionType, POIsAction } from '../pois/pois.actions'
import {
  FeedMetadata,
  FeedDisplayCategory,
  FeedGroupType,
  UserPartner,
  FeedEntourageType,
  FeedJoinStatus,
  FeedStatus,
} from 'src/core/api'
import { FilterEntourageType, FilterFeedCategory } from 'src/utils/types'
import { FeedAction, FeedActionType } from './feed.actions'

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
  filters: Record<FilterEntourageType, FilterFeedCategory[]>;
  itemsUuids: string[];
  items: {
    [itemUuid: string]: FeedItem;
  };
  nextPageToken: string | null;
  selectedItemUuid: string | null;
  isUpdatingJoinStatus: boolean;
  isUpdatingStatus: boolean;
  isIdle: boolean;
}

export const defaultFeedState: FeedState = {
  fetching: false,
  filters: {
    [FilterEntourageType.CONTRIBUTION]: [
      FilterFeedCategory.MAT_HELP,
      FilterFeedCategory.OTHER,
      FilterFeedCategory.RESOURCE,
      FilterFeedCategory.SOCIAL],
    [FilterEntourageType.ASK_FOR_HELP]: [
      FilterFeedCategory.MAT_HELP,
      FilterFeedCategory.OTHER,
      FilterFeedCategory.RESOURCE,
      FilterFeedCategory.SOCIAL],
  },
  itemsUuids: [],
  nextPageToken: null,
  items: {},
  selectedItemUuid: null,
  isUpdatingJoinStatus: false,
  isUpdatingStatus: false,
  isIdle: true,
}

export function feedReducer(
  state: FeedState = defaultFeedState,
  action: FeedAction | POIsAction | LocationAction,
): FeedState {
  switch (action.type) {
    case LocationActionType.SET_LOCATION: {
      return {
        ...state,
        nextPageToken: null,
      }
    }
    case FeedActionType.RETRIEVE_FEED_STARTED:
    case FeedActionType.RETRIEVE_FEED_NEXT_PAGE_STARTED: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FeedActionType.RETRIEVE_FEED_SUCCEEDED: {
      return {
        ...state,
        isIdle: false,
        items: action.payload.items.reduce(
          (acc: FeedState['items'], item: FeedState['items'][number]) => {
            return {
              ...acc,
              [item.uuid]: item,
            }
          }, state.items,
        ),
        itemsUuids: action.payload.items.map((item: FeedItem) => item.uuid),
        nextPageToken: action.payload.nextPageToken,
        fetching: false,
      }
    }

    case FeedActionType.RETRIEVE_FEED_NEXT_PAGE_SUCCEEDED: {
      return {
        ...state,
        items: action.payload.items.reduce(
          (acc: FeedState['items'], item: FeedState['items'][number]) => {
            return {
              ...acc,
              [item.uuid]: item,
            }
          }, state.items,
        ),
        itemsUuids: [
          ...state.itemsUuids,
          ...action.payload.items.map((item) => item.uuid),
        ],
        nextPageToken: action.payload.nextPageToken,
        fetching: false,
      }
    }

    case FeedActionType.UPDATE_ITEM: {
      return produce(state, (draftState) => {
        const { uuid } = action.payload
        if (!uuid) {
          throw new Error('UUID is required for item update')
        }

        const item = draftState.items[uuid]

        if (!item) {
          throw new Error(`item with uuid ${uuid} is not defined`)
        }

        // eslint-disable-next-line
        draftState.items[uuid] = {
          ...item,
          ...action.payload,
        }
      })
    }

    case FeedActionType.SET_CURRENT_ITEM_UUID: {
      return {
        ...state,
        selectedItemUuid: action.payload,
      }
    }

    case FeedActionType.REMOVE_CURRENT_ITEM_UUID: {
      return {
        ...state,
        selectedItemUuid: null,
      }
    }

    case POIsActionType.SET_CURRENT_POI_UUID: {
      return {
        ...state,
        selectedItemUuid: null,
      }
    }

    case FeedActionType.JOIN_ENTOURAGE:
    case FeedActionType.LEAVE_ENTOURAGE: {
      return {
        ...state,
        isUpdatingJoinStatus: true,
      }
    }

    case FeedActionType.JOIN_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        isUpdatingJoinStatus: false,
        items: produce(state.items, (cachedItems) => {
          const item = cachedItems[action.payload.entourageUuid]
          item.joinStatus = action.payload.status
        }),
      }
    }

    case FeedActionType.LEAVE_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        isUpdatingJoinStatus: false,
        items: produce(state.items, (cachedItems) => {
          const item = cachedItems[action.payload.entourageUuid]
          item.joinStatus = 'not_requested'
        }),
      }
    }

    case FeedActionType.REOPEN_ENTOURAGE:
    case FeedActionType.CLOSE_ENTOURAGE: {
      return {
        ...state,
        isUpdatingStatus: true,
      }
    }

    case FeedActionType.CLOSE_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        isUpdatingStatus: false,
        items: produce(state.items, (cachedItems) => {
          const item = cachedItems[action.payload.entourageUuid]
          item.status = 'closed'
        }),
      }
    }

    case FeedActionType.REOPEN_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        isUpdatingStatus: false,
        items: produce(state.items, (cachedItems) => {
          const item = cachedItems[action.payload.entourageUuid]
          item.status = 'open'
        }),
      }
    }

    case FeedActionType.CANCEL_FEED: {
      return {
        ...state,
        nextPageToken: null,
      }
    }

    case FeedActionType.TOGGLE_FEED_FILTER: {
      const currentFeedFilters = state.filters[action.payload.type]
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.type]: currentFeedFilters.includes(action.payload.category)
            ? currentFeedFilters.filter((i) => i !== action.payload.category)
            : [...currentFeedFilters, action.payload.category],
        },
      }
    }

    default:
      return state
  }
}
