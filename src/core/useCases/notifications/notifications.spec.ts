import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'

import { constants } from 'src/constants'
import { createAlert, fakeNotificationsData } from './__mocks__'
import { publicActions } from './notifications.actions'
import { Alert, defaultNotificationsState } from './notifications.reducer'
import { selectAlerts, selectAlertToShow, selectNotifications } from './notifications.selectors'

function configureStoreWithAlerts(
  params: {
    dependencies?: PartialAppDependencies;
    initialAppState?: PartialAppState;
  },
) {
  const { initialAppState, dependencies } = params

  return configureStore({
    reducers,
    initialState: {
      ...defaultInitialAppState,
      ...initialAppState,
    },
    dependencies,
  })
}

describe('Notifications', () => {
  it(`
   Given initial state
   When no action is triggered
   Then the notifications should be at default state
  `, async () => {
    const store = configureStoreWithAlerts({})

    await store.waitForActionEnd()

    expect(selectNotifications(store.getState())).toEqual(defaultNotificationsState)
  })

  it(`
   Given initial state
   When an alert occurs
   Then the alert should be added to the end of the alert queue
  `, async () => {
    const store = configureStoreWithAlerts({})

    const alert: Pick<Alert, 'severity' | 'message'> = {
      message: 'This is an error',
      severity: 'error',
    }

    store.dispatch(publicActions.addAlert(alert))

    await store.waitForActionEnd()

    const alerts = selectAlerts(store.getState())

    expect(alerts[alerts.length - 1]).toEqual({
      ...alert,
      id: alerts[alerts.length - 1].id,
    })
  })

  it(`
   Given initial state
   When the first alert of the alert queue is shifted
   Then the queue should be shifted
    And the alert currently shown should be the alert that was shifted
  `, async () => {
    const store = configureStoreWithAlerts({
      initialAppState: {
        ...defaultInitialAppState,
        notifications: {
          ...fakeNotificationsData,
        },
      },
    })

    store.dispatch(publicActions.shiftAndShowAlert())

    await store.waitForActionEnd()

    expect(selectAlertToShow(store.getState())).toEqual(fakeNotificationsData.alerts[0])
    expect(selectAlerts(store.getState()).length).toEqual(1)
  })

  it(`
   Given initial state
   When the alert queue is empty
    And the alert queue is shifted
   Then the queue should remain empty
     And no alert should be shown
  `, async () => {
    const store = configureStoreWithAlerts({})

    store.dispatch(publicActions.shiftAndShowAlert())

    await store.waitForActionEnd()

    expect(selectAlertToShow(store.getState())).toEqual(null)
    expect(selectAlerts(store.getState()).length).toEqual(0)
  })

  it(`
   Given initial state
   When an alert is shown
    And the alert is hidden
   Then there should be no alert to show
  `, async () => {
    const store = configureStoreWithAlerts({
      initialAppState: {
        ...defaultInitialAppState,
        notifications: {
          alerts: [],
          alertToShow: createAlert(),
        },
      },
    })

    store.dispatch(publicActions.hideAlert())

    await store.waitForActionEnd()

    expect(selectAlertToShow(store.getState())).toEqual(null)
  })

  it(`
   Given initial state
   When an alert is added
    And the alert queue is full
   Then the alert should not be added
  `, async () => {
    const alerts = Array(constants.NOTIFICATIONS_QUEUE_MAX).fill(createAlert())

    const store = configureStoreWithAlerts({
      initialAppState: {
        ...defaultInitialAppState,
        notifications: {
          alerts,
          alertToShow: null,
        },
      },
    })

    const alert: Pick<Alert, 'severity' | 'message'> = {
      message: 'This is an error',
      severity: 'error',
    }

    store.dispatch(publicActions.addAlert(alert))

    await store.waitForActionEnd()

    expect(selectAlerts(store.getState())).toEqual(alerts)
  })
})
