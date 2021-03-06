import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { createUser } from '../authUser/__mocks__'
import { defaultAuthUserState } from '../authUser/authUser.reducer'
import { feedActions, feedSaga, selectCurrentFeedItemUuid } from '../feed'
import { TestFeedGateway } from '../feed/TestFeedGateway'
import { defaultFeedState } from '../feed/feed.reducer'
import { poisActions, poisSaga, selectCurrentPOIUuid } from '../pois'
import { TestPOIsGateway } from '../pois/TestPOIsGateway'
import { defaultPOIsState } from '../pois/pois.reducer'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'

import { constants } from 'src/constants'
import { EntourageCities } from 'src/utils/types'
import { TestGeolocationService } from './TestGeolocationService'
import { fakeLocationData } from './__mocks__'
import { publicActions } from './location.actions'
import { LocationErrorGeolocationRefused } from './location.errors'
import { defaultLocationState, LocationState } from './location.reducer'
import { locationSaga } from './location.saga'
import {
  selectGeolocation,
  selectLocation,
  selectLocationIsInit,
  selectMapHasMoved,
  selectMapPosition,
} from './location.selectors'

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
    sagas: [locationSaga, poisSaga, feedSaga],
  })
}

describe('Location', () => {
  const { geolocation: defaultGeolocationData, ...defaultPositionData } = defaultLocationState

  const { isInit, mapPosition, ...restDefaultPositionData } = defaultPositionData

  const fakeGeolocationData = {
    ...fakeLocationData.center,
    displayAddress: fakeLocationData.displayAddress,
    googlePlaceId: 'placeId',
  }

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
    When user wants to update position filters
    Then filters should be updated
  `, () => {
    const store = configureStoreWithLocation({})
    const position: Partial<LocationState> = {
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
    When user wants to partially update position filters
    Then filters should be updated and merged with existing filters
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
      ...restDefaultPositionData,
      ...position,
    })
  })

  it(`
    Given the initial state
    When user wants to update map position
    Then map position should be updated
  `, () => {
    const store = configureStoreWithLocation({})
    const position: Partial<LocationState> = {
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.setMapPosition(position))

    expect(selectMapPosition(store.getState())).toStrictEqual(position)
  })

  it(`
    Given the initial state
    When user wants to partially update map position
    Then map position should be updated and merged with existing filters
  `, () => {
    const store = configureStoreWithLocation({})
    const position: Partial<LocationState> = {
      zoom: 12,
    }

    store.dispatch(publicActions.setMapPosition(position))

    expect(selectMapPosition(store.getState())).toStrictEqual({
      ...mapPosition,
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
      googlePlaceId: fakeGeolocationData.googlePlaceId,
    })

    const store = configureStoreWithLocation({ dependencies: { geolocationService } })

    geolocationService.getPlaceAddressFromCoordinates.resolveDeferredValue()

    const position: Partial<LocationState> = {
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

  // --------------------------------------------------

  describe('Geolocation', () => {
    it(`
      Given initial state
      When the user asks to use his geolocation
        And wants to update the position filter
        And the user has activated his geolocation
      The position filter should be set to the user's geolocation
        And the map position should be set to the user's geolocation with default zoom value
        And the geolocation value should be updated to the user's geolocation with default zoom value
    `, async () => {
      const geolocationService = new TestGeolocationService()

      geolocationService.getGeolocation.mockDeferredValueOnce({
        coordinates: fakeLocationData.center,
      })

      geolocationService.getPlaceAddressFromCoordinates.mockDeferredValueOnce({
        placeAddress: fakeLocationData.displayAddress,
        googlePlaceId: fakeGeolocationData.googlePlaceId,
      })

      const store = configureStoreWithLocation({
        initialAppState: {
          location: {
            ...defaultLocationState,
            zoom: 45,
            mapPosition: {
              ...defaultLocationState.mapPosition,
              zoom: 45,
            },
          },
        },
        dependencies: { geolocationService },
      })

      store.dispatch(publicActions.getGeolocation({ updateLocationFilter: true }))

      geolocationService.getGeolocation.resolveDeferredValue()
      geolocationService.getPlaceAddressFromCoordinates.resolveDeferredValue()
      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...fakeLocationData,
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      })

      expect(selectMapPosition(store.getState())).toStrictEqual({
        center: {
          lat: fakeGeolocationData.lat,
          lng: fakeGeolocationData.lng,
        },
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      })

      expect(selectGeolocation(store.getState())).toStrictEqual({
        ...fakeGeolocationData,
      })
    })

    it(`
      Given initial state
      When the user asks to use his geolocation
        And doesn't want to update the position filter
        And the user has activated his geolocation
      The position filter should stay at the default value
        And the map position should stay at the default value
        And the geolocation value should be updated to the user's geolocation
    `, async () => {
      const geolocationService = new TestGeolocationService()

      geolocationService.getGeolocation.mockDeferredValueOnce({
        coordinates: fakeLocationData.center,
      })

      geolocationService.getPlaceAddressFromCoordinates.mockDeferredValueOnce({
        placeAddress: fakeLocationData.displayAddress,
        googlePlaceId: fakeGeolocationData.googlePlaceId,
      })

      const store = configureStoreWithLocation({ dependencies: { geolocationService } })

      store.dispatch(publicActions.getGeolocation({ updateLocationFilter: false }))

      geolocationService.getGeolocation.resolveDeferredValue()
      geolocationService.getPlaceAddressFromCoordinates.resolveDeferredValue()
      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...restDefaultPositionData,
      })

      expect(selectMapPosition(store.getState())).toStrictEqual({
        ...mapPosition,
      })

      expect(selectGeolocation(store.getState())).toStrictEqual({
        ...fakeGeolocationData,
      })
    })

    it(`
      Given initial state
      When the user asks to use his geolocation
        And wants to update the position filter
        And the user has blocked his geolocation
      The position filter should stay at the default value
        And the map position should stay at the default value
        And the geolocation value should stay at the default value
    `, async () => {
      const geolocationService = new TestGeolocationService()

      geolocationService.getGeolocation.mockDeferredValueOnce({
        coordinates: fakeLocationData.center,
      })

      const store = configureStoreWithLocation({ dependencies: { geolocationService } })

      store.dispatch(publicActions.getGeolocation({ updateLocationFilter: true }))

      geolocationService.getGeolocation.rejectDeferredValue(new LocationErrorGeolocationRefused())
      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...restDefaultPositionData,
      })

      expect(selectMapPosition(store.getState())).toStrictEqual({
        ...mapPosition,
      })

      expect(selectGeolocation(store.getState())).toStrictEqual(defaultGeolocationData)
    })

    it(`
      Given initial state
      When the user asks to use his geolocation
        And doesn't want to update the position filter
        And the user has blocked his geolocation
      The position filter should stay at the default value
        And the map position should stay at the default value
        And the geolocation value should stay at the default value
    `, async () => {
      const geolocationService = new TestGeolocationService()

      geolocationService.getGeolocation.mockDeferredValueOnce({
        coordinates: fakeLocationData.center,
      })

      const store = configureStoreWithLocation({ dependencies: { geolocationService } })

      store.dispatch(publicActions.getGeolocation({ updateLocationFilter: false }))

      geolocationService.getGeolocation.rejectDeferredValue(new LocationErrorGeolocationRefused())
      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...restDefaultPositionData,
      })

      expect(selectMapPosition(store.getState())).toStrictEqual({
        ...mapPosition,
      })

      expect(selectGeolocation(store.getState())).toStrictEqual(defaultGeolocationData)
    })
  })

  // --------------------------------------------------

  describe('Default user location', () => {
    it(`
      Given initial state
      When the selected feed item uuid is set as a city
      The position filter should be set to the cities coordinates with default zoom value
        And the map position should be set to the cities coordinates with default zoom value
        And the location should be initialized
    `, async () => {
      const geolocationService = new TestGeolocationService()

      const store = configureStoreWithLocation({
        initialAppState: {
          feed: {
            ...defaultFeedState,
          },
          location: {
            ...defaultLocationState,
            zoom: 45,
            mapPosition: {
              ...defaultLocationState.mapPosition,
              zoom: 45,
            },
          },
        },
        dependencies: { geolocationService },
      })

      store.dispatch(feedActions.setCurrentFeedItemUuid('lyon'))

      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...EntourageCities.lyon,
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      })
      expect(selectMapPosition(store.getState())).toStrictEqual({
        center: EntourageCities.lyon.center,
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      })

      expect(selectCurrentFeedItemUuid(store.getState())).toBe(null)
      expect(selectLocationIsInit(store.getState())).toBe(true)
    })

    it(`
      Given initial state
      When the selected POI uuid is set as a city
      The position filter should be set to the cities coordinates with default zoom value
        And the map position should be set to the cities coordinates with default zoom value
        And the location should be initialized
    `, async () => {
      const geolocationService = new TestGeolocationService()

      const store = configureStoreWithLocation({
        initialAppState: {
          pois: {
            ...defaultPOIsState,
          },
          location: {
            ...defaultLocationState,
            zoom: 45,
            mapPosition: {
              ...defaultLocationState.mapPosition,
              zoom: 45,
            },
          },
        },
        dependencies: { geolocationService },
      })

      store.dispatch(poisActions.setCurrentPOIUuid('lyon'))

      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...EntourageCities.lyon,
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      })
      expect(selectMapPosition(store.getState())).toStrictEqual({
        center: EntourageCities.lyon.center,
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      })

      expect(selectCurrentPOIUuid(store.getState())).toBe(null)
      expect(selectLocationIsInit(store.getState())).toBe(true)
    })

    it(`
      Given initial state
      When the default position is initialized
        And no query id is present
        And the user is logged in and has a default address
      The position filter should be set to the user's default coordinates with default zoom value
        And the map position should be set to the user's default coordinates with default zoom value
        And the location should be initialized
    `, async () => {
      const geolocationService = new TestGeolocationService()

      const user = createUser(false, true)
      const store = configureStoreWithLocation({
        initialAppState: {
          authUser: {
            ...defaultAuthUserState,
            user,
          },
          location: {
            ...defaultLocationState,
            zoom: 45,
            mapPosition: {
              ...defaultLocationState.mapPosition,
              zoom: 45,
            },
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
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      }

      expect(selectLocation(store.getState())).toStrictEqual(defaultPosition)
      expect(selectMapPosition(store.getState())).toStrictEqual({
        center: defaultPosition.center,
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      })

      expect(selectLocationIsInit(store.getState())).toBe(true)
    })

    it(`
      Given initial state
      When the default position is initialized
        And no query id is present
        And the user is not logged in or doesn't have a default address
        And the user has activated his geolocation
      The position filter should be set to the user's geolocation
        And the map position should be set to the user's geolocation
        And the location should be initialized
    `, async () => {
      const geolocationService = new TestGeolocationService()

      const store = configureStoreWithLocation({
        initialAppState: {
          location: {
            ...defaultLocationState,
            zoom: 45,
            mapPosition: {
              ...defaultLocationState.mapPosition,
              zoom: 45,
            },
          },
        },
        dependencies: { geolocationService },
      })

      geolocationService.getGeolocation.mockDeferredValueOnce({
        coordinates: fakeLocationData.center,
      })

      geolocationService.getPlaceAddressFromCoordinates.mockDeferredValueOnce({
        placeAddress: fakeLocationData.displayAddress,
        googlePlaceId: 'placeId',
      })

      store.dispatch(publicActions.initLocation())

      geolocationService.getGeolocation.resolveDeferredValue()
      geolocationService.getPlaceAddressFromCoordinates.resolveDeferredValue()

      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...fakeLocationData,
        zoom: defaultPositionData.zoom,
      })

      expect(selectMapPosition(store.getState())).toStrictEqual({
        center: fakeLocationData.center,
        zoom: defaultPositionData.zoom,
      })

      expect(selectGeolocation(store.getState())).toStrictEqual({
        ...fakeGeolocationData,
      })
      expect(selectLocationIsInit(store.getState())).toBe(true)
    })

    it(`
      Given initial state
      When the default position is initialized
        And feed is initialized
        And no query id is present
        And the user is not logged in or doesn't have a default address
        And the user has blocked his geolocation
      The position filter should be set to the default state position
        And the map position should be set to the default state position
        And the location should be initialized
        And feed items should be retrieved from gateway
    `, async () => {
      const geolocationService = new TestGeolocationService()
      const feedGateway = new TestFeedGateway()
      feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })

      const store = configureStoreWithLocation({ dependencies: { geolocationService, feedGateway } })

      geolocationService.getGeolocation.mockDeferredValueOnce({
        coordinates: fakeLocationData.center,
      })

      store.dispatch(feedActions.init())

      store.dispatch(publicActions.initLocation())

      geolocationService.getGeolocation.rejectDeferredValue(new LocationErrorGeolocationRefused())
      feedGateway.retrieveFeedItems.resolveDeferredValue()

      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...restDefaultPositionData,
      })

      expect(selectMapPosition(store.getState())).toStrictEqual({
        ...mapPosition,
      })

      expect(selectGeolocation(store.getState())).toStrictEqual(defaultGeolocationData)
      expect(selectLocationIsInit(store.getState())).toBe(true)

      expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
    })

    it(`
      Given initial state
      When the default position is initialized
        And POIs is initialized
        And no query id is present
        And the user is not logged in or doesn't have a default address
        And the user has blocked his geolocation
      The position filter should be set to the default state position
        And the map position should be set to the default state position
        And the location should be initialized
        And POIs should be retrieved from gateway
    `, async () => {
      const geolocationService = new TestGeolocationService()
      const poisGateway = new TestPOIsGateway()
      poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })

      const store = configureStoreWithLocation({ dependencies: { geolocationService, poisGateway } })

      geolocationService.getGeolocation.mockDeferredValueOnce({
        coordinates: fakeLocationData.center,
      })

      store.dispatch(poisActions.init())

      store.dispatch(publicActions.initLocation())

      geolocationService.getGeolocation.rejectDeferredValue(new LocationErrorGeolocationRefused())
      poisGateway.retrievePOIs.resolveDeferredValue()

      await store.waitForActionEnd()

      expect(selectLocation(store.getState())).toStrictEqual({
        ...restDefaultPositionData,
      })

      expect(selectMapPosition(store.getState())).toStrictEqual({
        ...mapPosition,
      })

      expect(selectGeolocation(store.getState())).toStrictEqual(defaultGeolocationData)
      expect(selectLocationIsInit(store.getState())).toBe(true)

      expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
    })
  })

  it(`
    Given the initial state
    When map position is different than position filter
    Then map has moved button should be visible
  `, () => {
    const store = configureStoreWithLocation({})
    const position: Partial<LocationState> = {
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    const positionFilter: Partial<LocationState> = {
      center: { lat: 1, lng: 5 },
      zoom: 5,
    }

    store.dispatch(publicActions.setLocation({
      location: positionFilter,
    }))

    store.dispatch(publicActions.setMapPosition(position))

    expect(selectMapHasMoved(store.getState())).toBe(true)
  })

  it(`
    Given the initial state
    When map position is equal to position filter
    Then map has moved button should be hidden
  `, () => {
    const store = configureStoreWithLocation({})
    const position: Partial<LocationState> = {
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.setLocation({
      location: position,
    }))

    store.dispatch(publicActions.setMapPosition(position))

    expect(selectMapHasMoved(store.getState())).toBe(false)
  })
})
