import {
  ActionFromMapObject,
  ActionsFromMapObject,
} from 'src/utils/types'
import { Severity } from './notifications.reducer'

export const NotificationsActionType = {
  ADD: 'NOTIFICATIONS/ADD',
  SHIFT_AND_SHOW: 'NOTIFICATIONS/SHIFT_AND_SHOW',
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
// --------------------------------------------------------------------------------

export const publicActions = {
  addAlert,
  shiftAndShowAlert,
}

const privateActions = {
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type NotificationsActions = ActionsFromMapObject<typeof actions>
export type NotificationAction = ActionFromMapObject<typeof actions>
