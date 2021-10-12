import { NotificationsState } from './notifications.reducer'

interface AppState {
  notifications: NotificationsState;
}

export function selectNotifications(state: AppState) {
  return state.notifications
}

export function selectAlerts(state: AppState) {
  return state.notifications.alerts
}

export function selectAlertToShow(state: AppState) {
  return state.notifications.alertToShow
}
