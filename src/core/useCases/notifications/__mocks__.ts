import { uniqIntId } from 'src/utils/misc'
import { Alert, defaultNotificationsState, NotificationsState, Severity } from './notifications.reducer'

export function createError(): Alert {
  return {
    message: `This is error n°${uniqIntId()}`,
    severity: 'error' as Severity,
  }
}

export const fakeNotificationsData: NotificationsState = {
  ...defaultNotificationsState,
  alerts: [
    createError(),
    createError(),
  ],
  alertToShow: null,
}
