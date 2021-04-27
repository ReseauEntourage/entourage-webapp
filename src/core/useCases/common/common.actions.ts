import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'

export const CommonActionType = {
  FETCH_DATA: 'COMMON/FETCH_DATA',
} as const

export type CommonActionType = keyof typeof CommonActionType;

// ------------------------------------------------------------------------

function fetchData() {
  return {
    type: CommonActionType.FETCH_DATA,
  }
}

// --------------------------------------------------------------------------------

export const publicActions = {
  fetchData,
}

const privateActions = {
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type CommonActions = ActionsFromMapObject<typeof actions>
export type CommonAction = ActionFromMapObject<typeof actions>
