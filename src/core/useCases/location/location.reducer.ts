import { constants } from 'src/constants'
import { persistReducer } from 'src/core/utils/persistReducer'
import { LocationAction, LocationActionType } from './location.actions'

export interface LocationState {
  displayAddress: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  isInit: boolean;
  mapPosition: {
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
  };
  geolocation: {
    lat: number;
    lng: number;
    displayAddress: string;
    googlePlaceId: string | null;
  } | null;
}

export const defaultLocationState: LocationState = {
  displayAddress: constants.DEFAULT_LOCATION.DISPLAY_ADDRESS,
  center: constants.DEFAULT_LOCATION.CENTER,
  zoom: constants.DEFAULT_LOCATION.ZOOM,
  mapPosition: {
    center: constants.DEFAULT_LOCATION.CENTER,
    zoom: constants.DEFAULT_LOCATION.ZOOM,
  },
  isInit: false,
  geolocation: null,
}

function locationPureReducer(
  state: LocationState = defaultLocationState,
  action: LocationAction,
): LocationState {
  switch (action.type) {
    case LocationActionType.SET_LOCATION: {
      return {
        ...state,
        ...action.payload.location,
        isInit: true,
      }
    }

    case LocationActionType.SET_LOCATION_INIT: {
      return {
        ...state,
        isInit: true,
      }
    }

    case LocationActionType.SET_MAP_POSITION: {
      return {
        ...state,
        mapPosition: {
          ...state.mapPosition,
          ...action.payload,
        },
      }
    }

    case LocationActionType.SET_DISPLAY_ADDRESS: {
      return {
        ...state,
        displayAddress: action.payload.displayAddress,
      }
    }

    case LocationActionType.SET_GEOLOCATION: {
      return {
        ...state,
        geolocation: action.payload.geolocation ? {
          ...state.geolocation,
          ...action.payload.geolocation,
        } : null,
      }
    }

    default:
      return state
  }
}

export const locationReducer = persistReducer('location', locationPureReducer, {
  blacklist: ['isInit'],
})
