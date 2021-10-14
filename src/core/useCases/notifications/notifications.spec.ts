import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'

import { createError, fakeNotificationsData } from './__mocks__'
import { publicActions } from './notifications.actions'
import { Alert } from './notifications.reducer'
import { selectAlerts, selectAlertToShow } from './notifications.selectors'

function configureStoreWithErrors(
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
   When an error occurs
   Then the error should be added to the end of the alert queue
  `, async () => {
    const store = configureStoreWithErrors({})

    const error: Alert = {
      message: 'This is an error',
      severity: 'error',
    }

    store.dispatch(publicActions.addAlert(error))

    await store.waitForActionEnd()

    const alerts = selectAlerts(store.getState())

    expect(alerts[alerts.length - 1]).toEqual(error)
  })

  it(`
   Given initial state
   When the first error of the alert queue is shifted
   Then the queue should be shifted
    And the alert currently shown should be the error that was shifted
  `, async () => {
    const store = configureStoreWithErrors({
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
   When an alert is shown
    And the alert is hidden
   Then there should be no alert to show
  `, async () => {
    const store = configureStoreWithErrors({
      initialAppState: {
        ...defaultInitialAppState,
        notifications: {
          alerts: [],
          alertToShow: createError(),
        },
      },
    })

    store.dispatch(publicActions.hideAlert())

    await store.waitForActionEnd()

    expect(selectAlertToShow(store.getState())).toEqual(null)
  })
})
