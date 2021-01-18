import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'

export const ActionType = {
  SET_LOCALE: 'LOCALE/SET_LOCALE',
  SET_LOCALE_SUCCEEDED: 'LOCALE/SET_LOCALE_SUCCEEDED',
  GET_BROWSER_LOCALE: 'LOCALE/GET_BROWSER_LOCALE',
  GET_LOCALE: 'LOCALE/GET_LOCALE',
} as const

export type ActionType = keyof typeof ActionType;

// ------------------------------------------------------------------------

function setLocale(payload: { locale: string; }) {
  return {
    type: ActionType.SET_LOCALE,
    payload,
  }
}

function setLocaleSucceeded(payload: { locale: string; }) {
  return {
    type: ActionType.SET_LOCALE_SUCCEEDED,
    payload,
  }
}

function getBrowserLocale() {
  return {
    type: ActionType.GET_BROWSER_LOCALE,
  }
}

function getLocale() {
  return {
    type: ActionType.GET_LOCALE,
  }
}

// --------------------------------------------------------------------------------

export const publicActions = {
  getLocale,
  setLocale,
}

const privateActions = {
  setLocaleSucceeded,
  getBrowserLocale,
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type Actions = ActionsFromMapObject<typeof actions>
export type Action = ActionFromMapObject<typeof actions>
