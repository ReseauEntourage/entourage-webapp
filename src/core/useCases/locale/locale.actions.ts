import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { Locale } from './locale.reducer'

export const ActionType = {
  SET_LOCALE: 'LOCALE/SET_LOCALE',
  INIT_LOCALE: 'LOCALE/INIT_LOCALE',
} as const

export type ActionType = keyof typeof ActionType;

// ------------------------------------------------------------------------

function setLocale(payload: { locale: Locale; }) {
  return {
    type: ActionType.SET_LOCALE,
    payload,
  }
}

function initLocale() {
  return {
    type: ActionType.INIT_LOCALE,
  }
}

// --------------------------------------------------------------------------------

export const publicActions = {
  initLocale,
  setLocale,
}

const privateActions = {

}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type Actions = ActionsFromMapObject<typeof actions>
export type Action = ActionFromMapObject<typeof actions>
