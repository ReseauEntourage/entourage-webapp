import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { LocationState } from './location.reducer'

export const LocationActionType = {
  INIT_LOCATION: 'LOCATION/INIT_LOCATION',
  SET_LOCATION: 'LOCATION/SET_LOCATION',
  SET_DISPLAY_ADDRESS: 'LOCATION/SET_DISPLAY_ADDRESS',
  GET_GEOLOCATION: 'LOCATION/GET_GEOLOCATION',
} as const

export type LocationActionType = keyof typeof LocationActionType;

// ------------------------------------------------------------------------

function initLocation() {
  return {
    type: LocationActionType.INIT_LOCATION,
  }
}

function setLocation(payload: {
  location: Partial<LocationState>;
  getDisplayAddressFromCoordinates?: boolean;
}) {
  return {
    type: LocationActionType.SET_LOCATION,
    payload,
  }
}

function setDisplayAddress(payload: Pick<LocationState, 'displayAddress'>) {
  return {
    type: LocationActionType.SET_DISPLAY_ADDRESS,
    payload,
  }
}

function getGeolocation() {
  return {
    type: LocationActionType.GET_GEOLOCATION,
  }
}

// --------------------------------------------------------------------------------

export const publicActions = {
}

const privateActions = {
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type LocationActions = ActionsFromMapObject<typeof actions>
export type LocationAction = ActionFromMapObject<typeof actions>
