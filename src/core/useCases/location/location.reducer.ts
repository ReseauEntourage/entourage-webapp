import { constants } from 'src/constants'
import { persistReducer } from 'src/core/utils/persistReducer'
import { LocationAction, LocationActionType } from './location.actions'

type CityLocation = Pick<LocationState, 'center' | 'displayAddress'>

export type Cities = 'paris' | 'lyon' | 'rennes' | 'lille' | 'hauts-de-seine' | 'seine-saint-denis'

export const entourageCities: Record<Cities, CityLocation> = {
  paris: {
    displayAddress: 'Paris, France',
    center: {
      lat: 48.856614,
      lng: 2.3522219,
    },
  },
  lyon: {
    displayAddress: 'Lyon, France',
    center: {
      lat: 45.764043,
      lng: 4.835659,
    },
  },
  lille: {
    displayAddress: 'Lille, France',
    center: {
      lat: 50.62925,
      lng: 3.057256,
    },
  },
  rennes: {
    displayAddress: 'Rennes, France',
    center: {
      lat: 48.117266,
      lng: -1.6777926,
    },
  },
  'hauts-de-seine': {
    displayAddress: 'Hauts-de-Seine, France',
    center: {
      lat: 48.828508,
      lng: 2.2188068,
    },
  },
  'seine-saint-denis': {
    displayAddress: 'Seine-Saint-Denis, France',
    center: {
      lat: 48.9137455,
      lng: 2.4845729,
    },
  },
}

export interface LocationState {
  displayAddress: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export const defaultLocationState: LocationState = {
  displayAddress: constants.DEFAULT_LOCATION.DISPLAY_ADDRESS,
  center: constants.DEFAULT_LOCATION.CENTER,
  zoom: constants.DEFAULT_LOCATION.ZOOM,
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

export const locationReducer = persistReducer('location', locationPureReducer)
