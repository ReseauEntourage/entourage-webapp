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
import { assertCondition } from 'src/utils/misc'
import { FilterEntourageType, FilterFeedCategory, FilterFeedTimeRangeValues } from 'src/utils/types'
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

export interface FeedEntourage {
  itemType: 'Entourage';
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
  online: boolean;
  eventUrl: string;
  numberOfPeople: number;
}

export interface FeedAnnouncement {
  itemType: 'Announcement';
  id: number;
  uuid: string;
  title: string;
  body: string;
  imageUrl?: string;
  action: string;
  url: string;
  webappUrl?: string;
  iconUrl: string;
}

export interface FeedState {
  fetching: boolean;
  filters: {
    actionTypes: Record<FilterEntourageType, FilterFeedCategory[]>;
    events: boolean;
    timeRange: FilterFeedTimeRangeValues;
  };
  itemsUuids: string[];
  items: {
    [itemUuid: string]: FeedEntourage | FeedAnnouncement;
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
    actionTypes: {
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
    events: true,
    timeRange: FilterFeedTimeRangeValues.ONE_WEEK,
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
        itemsUuids: action.payload.items.map((item: FeedEntourage | FeedAnnouncement) => item.uuid),
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
          ...action.payload.items.map((item: FeedState['items'][number]) => item.uuid),
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

        assertCondition(item.itemType === 'Entourage')

        // eslint-disable-next-line
        draftState.items[uuid] = {
          ...item,
          ...action.payload,
        } as FeedEntourage
      })
    }

    case FeedActionType.SET_CURRENT_ITEM_UUID: {
      return {
        ...state,
        selectedItemUuid: action.payload,
        nextPageToken: action.payload ? state.nextPageToken : null,
      }
    }

    case FeedActionType.INSERT_FEED_ITEM: {
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.uuid]: action.payload,
        },
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
          assertCondition(item.itemType === 'Entourage')
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
          assertCondition(item.itemType === 'Entourage')
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
          assertCondition(item.itemType === 'Entourage')
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
          assertCondition(item.itemType === 'Entourage')
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

    case FeedActionType.TOGGLE_ACTION_TYPES_FILTER: {
      const currentActionTypesFilters = state.filters.actionTypes[action.payload.type as FilterEntourageType]

      if (action.payload.category) {
        return {
          ...state,
          filters: {
            ...state.filters,
            actionTypes: {
              ...state.filters.actionTypes,
              [action.payload.type]: currentActionTypesFilters.includes(action.payload.category)
                ? currentActionTypesFilters.filter((i) => i !== action.payload.category)
                : [...currentActionTypesFilters, action.payload.category],
            },
          },
          nextPageToken: null,
        }
      }

      return {
        ...state,
        filters: {
          ...state.filters,
          actionTypes: {
            ...state.filters.actionTypes,
            [action.payload.type]: currentActionTypesFilters.length === 0
              ? defaultFeedState.filters.actionTypes[action.payload.type as FilterEntourageType]
              : [],
          },
        },
        nextPageToken: null,
      }
    }

    case FeedActionType.TOGGLE_EVENTS_FILTER: {
      const currentEventsFilters = state.filters.events

      return {
        ...state,
        filters: {
          ...state.filters,
          events: !currentEventsFilters,
        },
        nextPageToken: null,
      }
    }

    case FeedActionType.SET_TIME_RANGE_FILTER: {
      return {
        ...state,
        filters: {
          ...state.filters,
          timeRange: action.payload,
        },
        nextPageToken: null,
      }
    }

    default:
      return state
  }
}
