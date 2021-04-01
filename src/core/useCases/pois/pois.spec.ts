import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { locationActions, LocationState, selectLocation } from '../location'
import { defaultLocationState } from '../location/location.reducer'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'
import { formatPOIsCategories, formatPOIsPartners } from 'src/utils/misc'
import { FilterPOICategory, FilterPOIPartner } from 'src/utils/types'
import { TestPOIsGateway } from './TestPOIsGateway'
import { fakePOIsData } from './__mocks__'

import { publicActions } from './pois.actions'
import { defaultPOIsState } from './pois.reducer'
import { calculateDistanceFromZoom, poisSaga } from './pois.saga'
import {
  selectPOIsFilters,
  selectIsActiveFilter,
  selectPOIsIsFetching,
  selectPOIsIsIdle,
  selectPOIList,
  selectAreFiltersDisabled,
} from './pois.selectors'

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
    const nextLocation: Partial<LocationState> = {
      displayAddress: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }
    store.dispatch(locationActions.setLocation({
      location: nextLocation,
    }))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(0)
  })

  it(`
    Given initial state
    When user init POIs
      And user toggles POI filters
    Then POIs should be fetched
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })
    const store = configureStoreWithPOIs({ dependencies: { poisGateway } })

    store.dispatch(publicActions.init())

    store.dispatch(publicActions.togglePOIsFilter({
      category: FilterPOICategory.EATING,
    }))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
    expect(poisGateway.retrievePOIs).toHaveBeenCalledWith({
      filters: {
        location: {
          center: defaultLocationState.center,
          zoom: calculateDistanceFromZoom(defaultLocationState.zoom),
        },
        categories: formatPOIsCategories([FilterPOICategory.EATING]),
      },
    })
  })

  it(`
    Given initial state
    When user init POIs
      And user resets all filters
    Then store should be update with new POI filters values
      And isActiveFilter selector should be disabled for all filters
      And all filters should be disabled
      And POIs should be fetched
      And should retrieve POIs gateway method have been called with POI filters values
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })
    const store = configureStoreWithPOIs({
      initialAppState: {
        ...defaultInitialAppState,
        pois: {
          ...defaultPOIsState,
          filters: {
            ...defaultPOIsState.filters,
            categories: [
              FilterPOICategory.ORIENTATION,
              FilterPOICategory.EATING,
              FilterPOICategory.PARTNERS,
              FilterPOICategory.SHOWERS,
              FilterPOICategory.SLEEPING,
            ],
          },
        },
      },
      dependencies: { poisGateway },
    })

    store.dispatch(publicActions.init())

    store.dispatch(publicActions.resetPOIsFilters())

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(Object.values(FilterPOICategory).map((filter) => selectIsActiveFilter(
      store.getState(),
      filter,
    ))).toStrictEqual(Array(Object.values(FilterPOICategory).length).fill(false))

    expect(selectAreFiltersDisabled(store.getState())).toBeTruthy()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
    expect(poisGateway.retrievePOIs).toHaveBeenCalledWith({
      filters: {
        location: {
          center: defaultLocationState.center,
          zoom: calculateDistanceFromZoom(defaultLocationState.zoom),
        },
      },
    })
  })

  it(`
    Given initial state
    When user init POIs
      And user toggles an already toggled POI filter
      And user toggles an non toggled partner filter
    Then store should be update with new POI filters values
      And isActiveFilter selector should be disabled for the specific filter
      And POIs should be fetched
      And should retrieve POIs gateway method have been called with POI filters values
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    const store = configureStoreWithPOIs({
      initialAppState: {
        ...defaultInitialAppState,
        pois: {
          ...defaultPOIsState,
          filters: {
            ...defaultPOIsState.filters,
            categories: [
              FilterPOICategory.EATING,
            ],
          },
        },
      },
      dependencies: { poisGateway } })

    store.dispatch(publicActions.init())

    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })

    store.dispatch(publicActions.togglePOIsFilter({
      category: FilterPOICategory.PARTNERS,
      partner: FilterPOIPartner.DONATIONS,
    }))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })

    store.dispatch(publicActions.togglePOIsFilter({
      category: FilterPOICategory.EATING,
    }))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectPOIsFilters(store.getState())).toEqual({
      categories: [FilterPOICategory.PARTNERS],
      partners: [FilterPOIPartner.DONATIONS],
    })

    expect(selectIsActiveFilter(
      store.getState(),
      FilterPOICategory.EATING,
    )).toBeFalsy()

    expect(selectIsActiveFilter(
      store.getState(),
      FilterPOICategory.PARTNERS,
      FilterPOIPartner.DONATIONS,
    )).toBeTruthy()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(2)
    expect(poisGateway.retrievePOIs).toHaveBeenCalledWith({
      filters: {
        location: {
          center: defaultLocationState.center,
          zoom: calculateDistanceFromZoom(defaultLocationState.zoom),
        },
        categories: formatPOIsCategories([FilterPOICategory.PARTNERS]),
        partners: formatPOIsPartners([FilterPOIPartner.DONATIONS]),
      },
    })
  })

  it(`
    Given initial state
      And the partner filters are toggled
    When user init POIs
      And user toggles the already toggled partner category filter
    Then store should be update with new POI filters values
      And isActiveFilter selector should be disabled for the specific filter
      And isActiveFilter selector should be disabled for all partner filters
      And POIs should be fetched
      And should retrieve POIs gateway method have been called with POI filters values
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })
    const store = configureStoreWithPOIs({
      initialAppState: {
        ...defaultInitialAppState,
        pois: {
          ...defaultPOIsState,
          filters: {
            categories: [
              FilterPOICategory.PARTNERS,
            ],
            partners: [
              FilterPOIPartner.DONATIONS,
              FilterPOIPartner.VOLUNTEERS,
            ],
          },
        },
      },
      dependencies: { poisGateway },
    })

    store.dispatch(publicActions.init())

    store.dispatch(publicActions.togglePOIsFilter({
      category: FilterPOICategory.PARTNERS,
    }))

    expect(selectPOIsFilters(store.getState())).toEqual({
      categories: [],
      partners: [],
    })
    expect(selectIsActiveFilter(
      store.getState(),
      FilterPOICategory.PARTNERS,
    )).toBeFalsy()

    expect(selectIsActiveFilter(
      store.getState(),
      FilterPOICategory.PARTNERS,
      FilterPOIPartner.DONATIONS,
    )).toBeFalsy()

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
    expect(poisGateway.retrievePOIs).toHaveBeenCalledWith({
      filters: {
        location: {
          center: defaultLocationState.center,
          zoom: calculateDistanceFromZoom(defaultLocationState.zoom),
        },
      },
    })
  })

  it(`
    Given initial state
      And the partner category filter is not toggled
    When user init POIs
      And user toggles the one of the partners filters
    Then store should be update with new POI filters values
      And isActiveFilter selector should be enabled for the specific partner filter
      And isActiveFilter selector should be enabled for the partner category filter
      And POIs should be fetched
      And should retrieve POIs gateway method have been called with POI filters values
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: [] })
    const initialFilters = defaultPOIsState.filters.categories.filter((i) => i !== FilterPOICategory.PARTNERS)

    const store = configureStoreWithPOIs({
      initialAppState: {
        ...defaultInitialAppState,
        pois: {
          ...defaultPOIsState,
          filters: {
            ...defaultPOIsState.filters,
            categories: initialFilters,
          },
        },
      },
      dependencies: { poisGateway },
    })

    store.dispatch(publicActions.init())

    store.dispatch(publicActions.togglePOIsFilter({
      category: FilterPOICategory.PARTNERS,
      partner: FilterPOIPartner.DONATIONS,
    }))

    expect(selectPOIsFilters(store.getState())).toEqual({
      categories: [
        ...initialFilters,
        FilterPOICategory.PARTNERS,
      ],
      partners: [FilterPOIPartner.DONATIONS],
    })
    expect(selectIsActiveFilter(
      store.getState(),
      FilterPOICategory.PARTNERS,
    )).toBeTruthy()

    expect(selectIsActiveFilter(
      store.getState(),
      FilterPOICategory.PARTNERS,
      FilterPOIPartner.DONATIONS,
    )).toBeTruthy()

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
    expect(poisGateway.retrievePOIs).toHaveBeenCalledWith({
      filters: {
        location: {
          center: defaultLocationState.center,
          zoom: calculateDistanceFromZoom(defaultLocationState.zoom),
        },
        categories: formatPOIsCategories([
          ...initialFilters,
          FilterPOICategory.PARTNERS,
        ]),
        partners: formatPOIsPartners([FilterPOIPartner.DONATIONS]),
      },
    })
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
    const nextLocation: Partial<LocationState> = {
      displayAddress: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.init())

    store.dispatch(locationActions.setLocation({
      location: nextLocation,
    }))

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
    const nextLocation: Partial<LocationState> = {
      displayAddress: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }
    store.dispatch(publicActions.init())

    store.dispatch(locationActions.setLocation({
      location: nextLocation,
    }))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    store.dispatch(publicActions.cancel())

    const nextNextLocation: Partial<LocationState> = {
      displayAddress: 'Nantes',
      center: { lat: 5, lng: 6 },
      zoom: 65,
    }

    store.dispatch(locationActions.setLocation({
      location: nextNextLocation,
    }))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
    expect(selectLocation(store.getState())).toStrictEqual(nextNextLocation)
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
    const nextLocation: Partial<LocationState> = {
      displayAddress: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }
    store.dispatch(publicActions.init())
    store.dispatch(locationActions.setLocation({
      location: nextLocation,
    }))

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
        location: {
          center: defaultLocationState.center,
          zoom: calculateDistanceFromZoom(defaultLocationState.zoom),
        },
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
    const nextLocation: Partial<LocationState> = {
      displayAddress: 'Lyon',
      center: { lat: 5, lng: 6 },
      zoom: 13,
    }

    store.dispatch(publicActions.init())
    store.dispatch(locationActions.setLocation({
      location: nextLocation,
    }))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(1)
    expect(poisGateway.retrievePOIs).toHaveBeenNthCalledWith(1, {
      filters: {
        location: {
          center: nextLocation.center,
          zoom: calculateDistanceFromZoom(nextLocation.zoom as number),
        },
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
