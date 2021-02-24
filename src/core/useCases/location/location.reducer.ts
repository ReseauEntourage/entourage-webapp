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
}

export const defaultLocationState: LocationState = {
  displayAddress: constants.DEFAULT_LOCATION.DISPLAY_ADDRESS,
  center: constants.DEFAULT_LOCATION.CENTER,
  zoom: constants.DEFAULT_LOCATION.ZOOM,
  isInit: false,
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

    case LocationActionType.SET_DISPLAY_ADDRESS: {
      return {
        ...state,
        displayAddress: action.payload.displayAddress,
      }
    }

    default:
      return state
  }
}

export const locationReducer = persistReducer('location', locationPureReducer, {
  blacklist: ['isInit'],
})
