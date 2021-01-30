import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { PositionState } from './position.reducer'

export const PositionActionType = {
  SET_POSITION: 'POSITION/SET_POSITION',
} as const

export type PositionActionType = keyof typeof PositionActionType;

// ------------------------------------------------------------------------

function setPosition(payload: Partial<PositionState['position']>) {
  return {
    type: PositionActionType.SET_POSITION,
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

export type PositionActions = ActionsFromMapObject<typeof actions>
export type PositionAction = ActionFromMapObject<typeof actions>
