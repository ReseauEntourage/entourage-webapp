import { uniqIntId } from 'src/utils/misc'
import { Alert, defaultNotificationsState, NotificationsState, Severity } from './notifications.reducer'

export function createAlert(): Alert {
  const id = uniqIntId()
  return {
    message: `This is error n°${id}`,
    severity: 'error' as Severity,
    id,
  }
}

export const fakeNotificationsData: NotificationsState = {
  ...defaultNotificationsState,
  alerts: [
    createAlert(),
    createAlert(),
  ],
  alertToShow: null,
}
