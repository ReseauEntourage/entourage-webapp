import { FeedAction, FeedActionType } from '../feed/feed.actions'
import { POICategory, POISource } from 'src/core/api'
import { FilterPOICategory } from 'src/utils/types'
import { POIsAction, POIsActionType } from './pois.actions'

export interface POI {
  uuid: string;
  name: string;
  longitude: number;
  latitude: number;
  address: string;
  phone: string | null;
  partnerId: string | null;
  categoryId: POICategory['id'];
}

export interface POIDetails {
  uuid: string;
  name: string;
  longitude: number;
  latitude: number;
  address: string;
  phone: string | null;
  description: string | null;
  categoryIds: POICategory['id'][];
  partnerId: string | null;
  website: string | null;
  email: string | null;
  hours: string | null;
  languages: string | null;
  audience: string | null;
  source: POISource;
  sourceUrl: string | null;
}

export interface POIsState {
  fetching: boolean;
  detailsFetching: boolean;
  poisUuids: string[];
  pois: {
    [poiUuid: string]: POI;
  };
  detailedPOIs: {
    [poiUuid: string]: POIDetails;
  };
  selectedPOIUuid: string | null;
  isIdle: boolean;
  filters: FilterPOICategory[];
}

export const defaultPOIsState: POIsState = {
  fetching: false,
  detailsFetching: false,
  poisUuids: [],
  pois: {},
  detailedPOIs: {},
  selectedPOIUuid: null,
  isIdle: true,
  filters: [
    FilterPOICategory.OTHER,
    FilterPOICategory.EATING,
    FilterPOICategory.SLEEPING,
    FilterPOICategory.HEALING,
    FilterPOICategory.ORIENTATION,
    FilterPOICategory.REINTEGRATION,
    FilterPOICategory.PARTNERS,
    FilterPOICategory.TOILETS,
    FilterPOICategory.FOUNTAINS,
    FilterPOICategory.SHOWERS,
    FilterPOICategory.LAUNDRIES,
    FilterPOICategory.WELL_BEING,
    FilterPOICategory.CLOTHES,
    FilterPOICategory.DONATION_BOX,
    FilterPOICategory.CLOAKROOM,
  ],
}

export function poisReducer(state: POIsState = defaultPOIsState, action: POIsAction | FeedAction): POIsState {
  switch (action.type) {
    case POIsActionType.RETRIEVE_POIS_STARTED:
      return {
        ...state,
        fetching: true,
      }

    case POIsActionType.RETRIEVE_POIS_SUCCEEDED:
      return {
        ...state,
        isIdle: false,
        pois: action.payload.pois.reduce(
          (acc: POIsState['pois'], item: POIsState['pois'][number]) => {
            return {
              ...acc,
              [item.uuid]: item,
            }
          }, state.pois,
        ),
        poisUuids: action.payload.pois.map((item: POI) => item.uuid),
        fetching: false,
      }

    case POIsActionType.RETRIEVE_POI_DETAILS_ENDED:
      return {
        ...state,
        detailsFetching: false,
      }

    case POIsActionType.RETRIEVE_POI_DETAILS_SUCCEEDED:
      return {
        ...state,
        isIdle: false,
        detailedPOIs: {
          ...state.detailedPOIs,
          [action.payload.poiDetails.uuid]: action.payload.poiDetails,
        },
        detailsFetching: false,
      }

    case POIsActionType.SET_CURRENT_POI_UUID: {
      return {
        ...state,
        selectedPOIUuid: action.payload,
        detailsFetching: true,
      }
    }

    case POIsActionType.REMOVE_CURRENT_POI_UUID: {
      return {
        ...state,
        selectedPOIUuid: null,
      }
    }

    case FeedActionType.SET_CURRENT_ITEM_UUID: {
      return {
        ...state,
        selectedPOIUuid: null,
      }
    }

    case POIsActionType.TOGGLE_POIS_FILTER: {
      const currentFeedFilters = state.filters

      return {
        ...state,
        filters: currentFeedFilters.includes(action.payload.category)
          ? currentFeedFilters.filter((i) => i !== action.payload.category)
          : [...currentFeedFilters, action.payload.category],
      }
    }

    default:
      return state
  }
}
