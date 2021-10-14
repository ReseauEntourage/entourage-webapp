import {
  ActionFromMapObject,
  ActionsFromMapObject,
} from 'src/utils/types'
import { Severity } from './notifications.reducer'

export const NotificationsActionType = {
  ADD: 'NOTIFICATIONS/ADD',
  SHIFT_AND_SHOW: 'NOTIFICATIONS/SHIFT_AND_SHOW',
  HIDE: 'NOTIFICATIONS/HIDE',
} as const

// ------------------------------------------------------------------------

function addAlert(payload: {
  severity: Severity;
  message: string;
}) {
  return {
    type: NotificationsActionType.ADD,
    payload,
  }
}

function shiftAndShowAlert() {
  return {
    type: NotificationsActionType.SHIFT_AND_SHOW,
  }
}

function hideAlert() {
  return {
    type: NotificationsActionType.HIDE,
  }
}
// --------------------------------------------------------------------------------

export const publicActions = {
  addAlert,
  shiftAndShowAlert,
  hideAlert,
}

const privateActions = {
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type NotificationsActions = ActionsFromMapObject<typeof actions>
export type NotificationAction = ActionFromMapObject<typeof actions>
