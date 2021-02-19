import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { createUser } from '../authUser/__mocks__'
import { defaultAuthUserState } from '../authUser/authUser.reducer'
import { selectCurrentFeedItemUuid } from '../feed'
import { defaultFeedState } from '../feed/feed.reducer'
import { selectCurrentPOIUuid } from '../pois'
import { defaultPOIsState } from '../pois/pois.reducer'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'

import { TestGeolocationService } from './TestGeolocationService'
import { fakeLocationData } from './__mocks__'
import { publicActions } from './location.actions'
import { LocationErrorGeolocationRefused } from './location.errors'
import { defaultLocationState, entourageCities, LocationState } from './location.reducer'
import { locationSaga } from './location.saga'
import { selectLocation } from './location.selectors'

function configureStoreWithLocation(
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
    sagas: [locationSaga],
  })
}

describe('Location', () => {
  it(`
    Given initial state
    When no action is triggered
    Then location state should be at initial state
  `, () => {
    const store = configureStoreWithLocation({})
    expect(store.getState().location).toStrictEqual(defaultLocationState)
  })

  it(`
    Given the initial state
    When user wants to update all filters
    Then filters should be updated
  `, () => {
    const store = configureStoreWithLocation({})
    const position: LocationState = {
      displayAddress: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.setLocation({
      location: position,
    }))

    expect(selectLocation(store.getState())).toStrictEqual(position)
  })

  it(`
    Given the initial state
    When user wants to update partially update filters
    Then filters should be updated and merge with existing filters
  `, () => {
    const store = configureStoreWithLocation({})
    const position: Partial<LocationState> = {
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.setLocation({
      location: position,
    }))

    expect(selectLocation(store.getState())).toStrictEqual({
      ...defaultLocationState,
      ...position,
    })
  })

  it(`
    Given the initial state
    When user wants to update position filters
      And wants to get display address from coordinates
    Then filters should be updated
      And display address should be updated with geocoded display address
  `, async () => {
    const geolocationService = new TestGeolocationService()

    geolocationService.getPlaceAddressFromCoordinates.mockDeferredValueOnce({
      placeAddress: fakeLocationData.displayAddress,
    })

    const store = configureStoreWithLocation({ dependencies: { geolocationService } })

    geolocationService.getPlaceAddressFromCoordinates.resolveDeferredValue()

    const position: LocationState = {
      displayAddress: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.setLocation({
      location: position,
      getDisplayAddressFromCoordinates: true,
    }))

    await store.waitForActionEnd()

    expect(selectLocation(store.getState())).toStrictEqual({
      ...position,
      displayAddress: fakeLocationData.displayAddress,
    })
  })

  it(`
      Given initial state
      When the user asks to use his geolocation
        And the user has activated his geolocation
      The position filter should be set to the user's geolocation
    `, async () => {
    const geolocationService = new TestGeolocationService()

    geolocationService.getGeolocation.mockDeferredValueOnce({
      coordinates: fakeLocationData.center,
    })

    geolocationService.getPlaceAddressFromCoordinates.mockDeferredValueOnce({
      placeAddress: fakeLocationData.displayAddress,
    })

    const store = configureStoreWithLocation({ dependencies: { geolocationService } })

    store.dispatch(publicActions.getGeolocation())

    geolocationService.getGeolocation.resolveDeferredValue()
    geolocationService.getPlaceAddressFromCoordinates.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectLocation(store.getState())).toStrictEqual({
      ...fakeLocationData,
      zoom: defaultLocationState.zoom,
    })
  })

  it(`
      Given initial state
      When the user asks to use his geolocation
        And the user has blocked his geolocation
      The position filter should stay at the default value
    `, async () => {
    const geolocationService = new TestGeolocationService()

    geolocationService.getGeolocation.mockDeferredValueOnce({
      coordinates: fakeLocationData.center,
    })

    const store = configureStoreWithLocation({ dependencies: { geolocationService } })

    store.dispatch(publicActions.getGeolocation())

    geolocationService.getGeolocation.rejectDeferredValue(new LocationErrorGeolocationRefused())
    await store.waitForActionEnd()

    expect(selectLocation(store.getState())).toStrictEqual(defaultLocationState)
  })

  // --------------------------------------------------

  describe('Default user location', () => {
    it(`
      Given initial state
      When the default position is initialized
        And the select feed item uuid is a city
      The position filter should be set to the cities coordinates
    `, async () => {
      const geolocationService = new TestGeolocationService()

      const store = configureStoreWithLocation({
        initialAppState: {
          feed: {
            ...defaultFeedState,
            selectedItemUuid: 'lyon',
          },
        },
        dependencies: { geolocationService },
      })

      store.dispatch(publicActions.initLocation())

      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...entourageCities.lyon,
        zoom: defaultLocationState.zoom,
      })
      expect(selectCurrentFeedItemUuid(store.getState())).toBe(null)
    })

    it(`
      Given initial state
      When the default position is initialized
        And the select POI uuid is a city
      The position filter should be set to the cities coordinates
    `, async () => {
      const geolocationService = new TestGeolocationService()

      const store = configureStoreWithLocation({
        initialAppState: {
          pois: {
            ...defaultPOIsState,
            selectedPOIUuid: 'lyon',
          },
        },
        dependencies: { geolocationService },
      })

      store.dispatch(publicActions.initLocation())

      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...entourageCities.lyon,
        zoom: defaultLocationState.zoom,
      })
      expect(selectCurrentPOIUuid(store.getState())).toBe(null)
    })

    it(`
      Given initial state
      When the default position is initialized
        And no query id is present
        And the user is logged in and has a default address
      The position filter should be set to the user's default coordinates
    `, async () => {
      const geolocationService = new TestGeolocationService()

      const user = createUser(false, true)
      const store = configureStoreWithLocation({
        initialAppState: {
          authUser: {
            ...defaultAuthUserState,
            user,
          },
        },
        dependencies: { geolocationService },
      })

      store.dispatch(publicActions.initLocation())

      await store.waitForActionEnd()

      const defaultPosition = {
        displayAddress: user.address?.displayAddress,
        center: {
          lat: user.address?.latitude,
          lng: user.address?.longitude,
        },
        zoom: defaultLocationState.zoom,
      }

      expect(selectLocation(store.getState())).toStrictEqual(defaultPosition)
    })

    it(`
      Given initial state
      When the default position is initialized
        And no query id is present
        And the user is not logged in or doesn't have a default address
        And the user has activated his geolocation
      The position filter should be set to the user's geolocation
    `, async () => {
      const geolocationService = new TestGeolocationService()

      const store = configureStoreWithLocation({
        dependencies: { geolocationService },
      })

      geolocationService.getGeolocation.mockDeferredValueOnce({
        coordinates: fakeLocationData.center,
      })

      geolocationService.getPlaceAddressFromCoordinates.mockDeferredValueOnce({
        placeAddress: fakeLocationData.displayAddress,
      })

      store.dispatch(publicActions.initLocation())

      geolocationService.getGeolocation.resolveDeferredValue()
      geolocationService.getPlaceAddressFromCoordinates.resolveDeferredValue()

      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...fakeLocationData,
        zoom: defaultLocationState.zoom,
      })
    })
  })

  it(`
      Given initial state
      When the default position is initialized
        And no query id is present
        And the user is not logged in or doesn't have a default address
        And the user has blocked his geolocation
      The position filter should be set to the default state position
    `, async () => {
    const geolocationService = new TestGeolocationService()

    const store = configureStoreWithLocation({ dependencies: { geolocationService } })

    geolocationService.getGeolocation.mockDeferredValueOnce({
      coordinates: fakeLocationData.center,
    })

    store.dispatch(publicActions.initLocation())

    geolocationService.getGeolocation.rejectDeferredValue(new LocationErrorGeolocationRefused())

    await store.waitForActionEnd()

    expect(selectLocation(store.getState())).toStrictEqual(defaultLocationState)
  })
})
