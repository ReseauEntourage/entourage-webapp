import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { LocationState } from './location.reducer'

export const LocationActionType = {
  SET_POSITION: 'POSITION/SET_POSITION',
} as const

export type LocationActionType = keyof typeof LocationActionType;

// ------------------------------------------------------------------------

function setPosition(payload: Partial<LocationState['position']>) {
  return {
    type: LocationActionType.SET_POSITION,
    payload,
  }
}

// --------------------------------------------------------------------------------

export const publicActions = {
  setPosition,
}

const privateActions = {
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type LocationActions = ActionsFromMapObject<typeof actions>
export type LocationAction = ActionFromMapObject<typeof actions>
