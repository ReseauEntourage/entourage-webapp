import { constants } from 'src/constants'
import { LocationAction, LocationActionType } from './location.actions'

export interface LocationState {
  position: {
    cityName: string;
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
  };
}

export const defaultLocationState: LocationState = {
  position: {
    cityName: constants.DEFAULT_LOCATION.CITY_NAME,
    center: constants.DEFAULT_LOCATION.CENTER,
    zoom: constants.DEFAULT_LOCATION.ZOOM,
  },
}

/*
  TODO listen to AUTH_USER/LOGIN_WITH_PASSWORD_SUCCEEDED OR AUTH_USER/LOGIN_WITH_SMS_CODE_SUCCEEDED
    to update position with users default position after login
    https://entourage-asso.atlassian.net/browse/EN-3487
*/

export function locationReducer(
  state: LocationState = defaultLocationState,
  action: LocationAction /* | AuthUserAction */,
): LocationState {
  switch (action.type) {
    case LocationActionType.SET_POSITION: {
      return {
        ...state,
        position: {
          ...state.position,
          ...action.payload,
        },
      }
    }
    /*

    case AuthUserActionType.LOGIN_WITH_PASSWORD_SUCCEEDED:
    case AuthUserActionType.LOGIN_WITH_SMS_CODE_SUCCEEDED:
      return {
        ...state,
        position: {
          ...state.position,
          cityName: action.payload.user?.address?.displayAddress ?? state.position.cityName,
        },
      }
*/

    default:
      return state
  }

  return state
}
