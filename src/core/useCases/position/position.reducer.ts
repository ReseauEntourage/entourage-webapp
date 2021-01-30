import { constants } from '../../../constants'
import { PositionAction, PositionActionType } from './position.actions'

export interface PositionState {
  position: {
    cityName: string;
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
  };
}

export const defaultPositionState: PositionState = {
  position: {
    cityName: constants.DEFAULT_LOCATION.CITY_NAME,
    center: constants.DEFAULT_LOCATION.CENTER,
    zoom: constants.DEFAULT_LOCATION.ZOOM,
  },
}

/*
  TODO listen to AUTH_USER/LOGIN_WITH_PASSWORD_SUCCEEDED OR AUTH_USER/LOGIN_WITH_SMS_CODE_SUCCEEDED
  to update position with users default position after login
*/

export function positionReducer(
  state: PositionState = defaultPositionState,
  action: PositionAction /* | AuthUserAction */,
): PositionState {
  switch (action.type) {
    case PositionActionType.SET_POSITION: {
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
