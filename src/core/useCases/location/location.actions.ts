import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { LocationState } from './location.reducer'

export const LocationActionType = {
  INIT_LOCATION: 'LOCATION/INIT_LOCATION',
  SET_LOCATION: 'LOCATION/SET_LOCATION',
  SET_MAP_POSITION: 'LOCATION/SET_MAP_POSITION',
  SET_DISPLAY_ADDRESS: 'LOCATION/SET_DISPLAY_ADDRESS',
  GET_GEOLOCATION: 'LOCATION/GET_GEOLOCATION',
  SET_GEOLOCATION: 'LOCATION/SET_GEOLOCATION',
} as const

export type LocationActionType = keyof typeof LocationActionType;

// ------------------------------------------------------------------------

function initLocation() {
  return {
    type: LocationActionType.INIT_LOCATION,
  }
}

function setLocation(payload: {
  location: Partial<Pick<LocationState, 'zoom' | 'center' | 'displayAddress'>>;
  getDisplayAddressFromCoordinates?: boolean;
}) {
  return {
    type: LocationActionType.SET_LOCATION,
    payload,
  }
}

function setMapPosition(payload: Partial<LocationState['mapPosition']>) {
  return {
    type: LocationActionType.SET_MAP_POSITION,
    payload,
  }
}

function setGeolocation(payload: {
  geolocation: LocationState['geolocation'];
}) {
  return {
    type: LocationActionType.SET_GEOLOCATION,
    payload,
  }
}

function setDisplayAddress(payload: Pick<LocationState, 'displayAddress'>) {
  return {
    type: LocationActionType.SET_DISPLAY_ADDRESS,
    payload,
  }
}

function getGeolocation(payload: {
  updateLocationFilter: boolean;
}) {
  return {
    type: LocationActionType.GET_GEOLOCATION,
    payload,
  }
}

// --------------------------------------------------------------------------------

export const publicActions = {
  setLocation,
  initLocation,
  getGeolocation,
  setMapPosition,
}

const privateActions = {
  setDisplayAddress,
  setGeolocation,
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type LocationActions = ActionsFromMapObject<typeof actions>
export type LocationAction = ActionFromMapObject<typeof actions>
