import { constants } from 'src/constants'
import { uniqIntId } from 'src/utils/misc'
import { NotificationsActionType, NotificationAction } from './notifications.actions'

export type Severity = 'error'
| 'info'
| 'success'
| 'warning'

export interface Alert {
  id: number;
  message: string;
  severity: Severity;
}

export interface NotificationsState {
  alerts: Alert[];
  alertToShow: Alert | null;
}

export const defaultNotificationsState: NotificationsState = {
  alerts: [],
  alertToShow: null,
}

export function notificationsReducer(
  state: NotificationsState = defaultNotificationsState,
  action: NotificationAction,
): NotificationsState {
  switch (action.type) {
    case NotificationsActionType.ADD: {
      if (state.alerts.length < constants.NOTIFICATIONS_QUEUE_MAX) {
        return {
          ...state,
          alerts: [
            ...state.alerts,
            {
              ...action.payload,
              id: uniqIntId(),
            },
          ],
        }
      }
      return {
        ...state,
      }
    }

    case NotificationsActionType.SHIFT_AND_SHOW: {
      const { alerts } = state
      const alertToShow = alerts[0]
      return {
        ...state,
        alerts: alerts.length > 1 ? alerts.slice(1) : [],
        alertToShow: alertToShow ?? null,
      }
    }

    case NotificationsActionType.HIDE: {
      return {
        ...state,
        alertToShow: null,
      }
    }

    default:
      return state
  }
}
