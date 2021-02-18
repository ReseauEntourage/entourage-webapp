import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { locationActions, LocationState, selectPosition } from '../location'
import { defaultLocationState } from '../location/location.reducer'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'
import { TestPOIsGateway } from './TestPOIsGateway'
import { fakePOIsData } from './__mocks__'

import { publicActions } from './pois.actions'
import { defaultPOIsState } from './pois.reducer'
import { calculateDistanceFromZoom, poisSaga } from './pois.saga'
import { selectPOIsIsFetching, selectPOIsIsIdle, selectPOIList } from './pois.selectors'

function configureStoreWithPOIs(
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
    sagas: [poisSaga],
  })
}

describe('POIs', () => {
  it(`
    Given initial state
    When no action is triggered
    Then POIs state should be at initial state
  `, () => {
    const poisGateway = new TestPOIsGateway()
    const store = configureStoreWithPOIs({ dependencies: { poisGateway } })
    expect(store.getState().pois).toEqual(defaultPOIsState)
  })

  it(`
   Given initial state
     When user hasn't init POIs
      And user sets position filters
    Then POIs should not be fetched
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })
    const store = configureStoreWithPOIs({ dependencies: { poisGateway } })
    const nextLocation: LocationState['position'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }
    store.dispatch(locationActions.setPosition(nextLocation))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(0)
  })

  it(`
    Given initial state
    When user init POIs
      And user sets position filters
    Then POIs should be fetched
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })
    const store = configureStoreWithPOIs({ dependencies: { poisGateway } })
    const nextLocation: LocationState['position'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.init())

    store.dispatch(locationActions.setPosition(nextLocation))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
  })

  it(`
    Given initial state
    When user init POIs
      And user sets position filters
      And user cancels POIs
      And user sets a new position filter again
    Then items should be fetched only once
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })
    const store = configureStoreWithPOIs({ dependencies: { poisGateway } })
    const nextLocation: LocationState['position'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }
    store.dispatch(publicActions.init())

    store.dispatch(locationActions.setPosition(nextLocation))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    store.dispatch(publicActions.cancel())

    const nextNextLocation: LocationState['position'] = {
      cityName: 'Nantes',
      center: { lat: 5, lng: 6 },
      zoom: 65,
    }

    store.dispatch(locationActions.setPosition(nextNextLocation))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
    expect(selectPosition(store.getState())).toStrictEqual(nextNextLocation)
  })

  it(`
    Given user has not any POIs
    When user set position filters
    Then POIs should be fetching during request
      And POIs should not be fetching after request succeeded
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })

    const store = configureStoreWithPOIs({ dependencies: { poisGateway } })
    const nextLocation: LocationState['position'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }
    store.dispatch(publicActions.init())
    store.dispatch(locationActions.setPosition(nextLocation))

    expect(selectPOIsIsFetching(store.getState())).toEqual(true)

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectPOIsIsFetching(store.getState())).toEqual(false)
  })

  it(`
    Given POIs request is idle
    When no action is trigger by user
    Then POIs request should still be idle
  `, () => {
    const poisGateway = new TestPOIsGateway()
    const store = configureStoreWithPOIs({ dependencies: { poisGateway } })

    expect(selectPOIsIsIdle(store.getState())).toEqual(true)
  })

  it(`
    Given POIs request is idle
    When user retrieve POIs successfully
    Then POIs should not be idle
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })
    const store = configureStoreWithPOIs({ dependencies: { poisGateway } })

    store.dispatch(publicActions.retrievePOIs())

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectPOIsIsIdle(store.getState())).toEqual(false)
  })

  it(`
    Given there is POIs returned by the server
    When user retrieve POIs for the first time
    Then POIs items should be fetching until request is succeeded
      And should retrieve POIs successfully with items
      And should fetching state be false after server response
      And should retrieve POIs gateway method have been called with position filters values
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    const deferredValue = { pois: [fakePOIsData.pois.abc] }
    poisGateway.retrievePOIs.mockDeferredValueOnce(deferredValue)
    const store = configureStoreWithPOIs({ dependencies: { poisGateway } })

    store.dispatch(publicActions.retrievePOIs())

    expect(selectPOIsIsFetching(store.getState())).toEqual(true)

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectPOIList(store.getState())).toEqual([fakePOIsData.pois.abc])
    expect(selectPOIsIsFetching(store.getState())).toEqual(false)

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
    expect(poisGateway.retrievePOIs).toHaveBeenNthCalledWith(1, {
      filters: {
        center: defaultLocationState.position.center,
        zoom: calculateDistanceFromZoom(defaultLocationState.position.zoom),
      },
    })
  })

  it(`
    Given there is POIs returned by the server
    When user changes position filters
    Then should retrieve POIs gateway method have been called the second time with next position filters
  `, async () => {
    const poisGateway = new TestPOIsGateway()

    const deferredValue = { pois: [fakePOIsData.pois.abc] }
    poisGateway.retrievePOIs.mockDeferredValueOnce(deferredValue)

    const store = configureStoreWithPOIs({ dependencies: { poisGateway } })
    const nextLocation = {
      cityName: 'Lyon',
      center: { lat: 5, lng: 6 },
      zoom: 13,
    }

    store.dispatch(publicActions.init())
    store.dispatch(locationActions.setPosition(nextLocation))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
    expect(poisGateway.retrievePOIs).toHaveBeenNthCalledWith(1, {
      filters: {
        center: nextLocation.center,
        zoom: calculateDistanceFromZoom(nextLocation.zoom),
      },
    })
  })

  it(`
    Given POIs are fetching
    When user want to retrieve POIs
    Then the second request should never start
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })
    const store = configureStoreWithPOIs({ dependencies: { poisGateway } })

    store.dispatch(publicActions.retrievePOIs())

    expect(selectPOIsIsFetching(store.getState())).toEqual(true)

    store.dispatch(publicActions.retrievePOIs())

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
  })
})
