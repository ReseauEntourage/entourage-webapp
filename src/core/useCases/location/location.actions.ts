import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { LocationState } from './location.reducer'

export const LocationActionType = {
  INIT_LOCATION: 'LOCATION/INIT_LOCATION',
  SET_INIT_LOCATION: 'LOCATION/SET_INIT_LOCATION',
  SET_LOCATION: 'LOCATION/SET_LOCATION',
  SET_DISPLAY_ADDRESS: 'LOCATION/SET_DISPLAY_ADDRESS',
  GET_GEOLOCATION: 'LOCATION/GET_GEOLOCATION',
  SET_GEOLOCATION: 'LOCATION/SET_GEOLOCATION',
  SET_MAP_HAS_MOVED: 'LOCATION/MAP_HAS_MOVED',
} as const

export type LocationActionType = keyof typeof LocationActionType;

// ------------------------------------------------------------------------

function initLocation() {
  return {
    type: LocationActionType.INIT_LOCATION,
  }
}

function setInitLocation() {
  return {
    type: LocationActionType.SET_INIT_LOCATION,
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

function setMapHasMoved(payload: boolean) {
  return {
    type: LocationActionType.SET_MAP_HAS_MOVED,
    payload,
  }
}

// --------------------------------------------------------------------------------

export const publicActions = {
  setLocation,
  initLocation,
  getGeolocation,
  setMapHasMoved,
  setInitLocation,
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
