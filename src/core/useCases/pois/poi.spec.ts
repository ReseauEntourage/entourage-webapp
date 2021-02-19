import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { selectCurrentFeedItem } from '../feed'
import { entourageCities, selectLocation } from '../location'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'
import { TestPOIsGateway } from './TestPOIsGateway'
import { createPOIDetails, createPOIList, fakePOIsData } from './__mocks__'

import { publicActions } from './pois.actions'
import { calculateDistanceFromZoom, poisSaga } from './pois.saga'
import {
  selectPOIList,
  selectCurrentPOI,
  selectPOIDetailsIsFetching,
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

function configureStoreWithSelectedPOIs() {
  const poisFromStore = createPOIList()
  const poisFromGateway = createPOIList()

  const poisEntities = poisFromStore.reduce((acc, item) => ({
    ...acc,
    [item.uuid]: item,
  }), {})

  const poiDetailsFromStore = {
    ...createPOIDetails(),
    uuid: Object.keys(poisEntities)[0],
  }

  const poiDetailsFromGateway = {
    ...createPOIDetails(),
    uuid: Object.keys(poisEntities)[2],
  }

  const poisGateway = new TestPOIsGateway()
  poisGateway.retrievePOIs.mockDeferredValueOnce({ pois: poisFromGateway })
  poisGateway.retrievePOI.mockDeferredValueOnce({ poiDetails: poiDetailsFromGateway })

  const store = configureStoreWithPOIs(
    {
      dependencies: { poisGateway },
      initialAppState: {
        pois: {
          ...fakePOIsData,
          pois: poisEntities,
          poisUuids: Object.keys(poisEntities),
          selectedPOIUuid: Object.keys(poisEntities)[0],
          detailedPOIs: {
            [Object.keys(poisEntities)[0]]: poiDetailsFromStore,
          },
          isIdle: false,
        },
      },
    },
  )

  return {
    store,
    poisGateway,
    poisEntities,
  }
}

describe('POIs', () => {
  it(`
    Given POIs are at initial state
    When no action is triggered,
    Then selected POI should be null
  `, () => {
    const store = configureStoreWithPOIs({})

    expect(selectCurrentPOI(store.getState())).toEqual(null)
  })

  it(`
    Given POIs have been retrieved from gateway
    When user selects a POI that has never been selected before
    Then POI details should be fetching until request is succeeded
      And POI details should be retrieved successfully from gateway
      And selected POI be defined with these POI details
      And details fetching state be false after server response
      And selected feed item should be null
  `, async () => {
    const poisGateway = new TestPOIsGateway()

    const store = configureStoreWithPOIs({
      dependencies: { poisGateway },
      initialAppState: {
        pois: {
          ...fakePOIsData,
          isIdle: false,
        },
      },
    })
    const poiDetailsFromGateway = {
      ...createPOIDetails(),
      uuid: 'abc',
    }

    const deferredValueRetrievePOI = {
      poiDetails: poiDetailsFromGateway,
    }

    const selectedPOIId = poiDetailsFromGateway.uuid

    poisGateway.retrievePOI.mockDeferredValueOnce(deferredValueRetrievePOI)
    poisGateway.retrievePOI.resolveDeferredValue()

    store.dispatch(publicActions.setCurrentPOIUuid(selectedPOIId))
    expect(selectPOIDetailsIsFetching(store.getState())).toEqual(true)

    await store.waitForActionEnd()

    expect(poisGateway.retrievePOI).toHaveBeenCalledWith({ poiUuid: selectedPOIId })

    expect(selectCurrentPOI(store.getState())).toEqual(poiDetailsFromGateway)
    expect(selectPOIDetailsIsFetching(store.getState())).toEqual(false)

    expect(selectCurrentFeedItem(store.getState())).toEqual(null)
  })

  it(`
    Given POIs have been retrieved from gateway
    When user selects a POI that has already been selected before
    Then POI should not be retrieved from gateway
      And selected POI be defined with these POI details
      And selected feed item should be null
  `, async () => {
    const poisGateway = new TestPOIsGateway()
    const poiDetailsFromGateway = {
      ...createPOIDetails(),
      uuid: 'abc',
    }
    const store = configureStoreWithPOIs({
      dependencies: { poisGateway },
      initialAppState: {
        pois: {
          ...fakePOIsData,
          selectedPOIUuid: 'abc',
          detailedPOIs: {
            abc: poiDetailsFromGateway,
          },
          isIdle: false,
        },
      },
    })

    const deferredValueRetrievePOI = {
      poiDetails: {
        ...createPOIDetails(),
        uuid: 'abc',
      },
    }

    poisGateway.retrievePOI.mockDeferredValueOnce(deferredValueRetrievePOI)
    poisGateway.retrievePOI.resolveDeferredValue()

    await store.waitForActionEnd()

    expect(poisGateway.retrievePOI).toHaveBeenCalledTimes(0)

    expect(selectCurrentPOI(store.getState())).toEqual(poiDetailsFromGateway)

    expect(selectCurrentFeedItem(store.getState())).toEqual(null)
  })

  it(`
    Given POIs have been retrieved from gateway
      And POIs has selected POI uuid
    When user fetch new POIs
    Then POIs should changes
      And selected item should never change
  `, async () => {
    const { store, poisGateway } = configureStoreWithSelectedPOIs()

    const prevItems = selectPOIList(store.getState())
    const prevSelectedItem = selectCurrentPOI(store.getState())

    store.dispatch(publicActions.retrievePOIs())

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    const nextItems = selectPOIList(store.getState())
    const nextSelectedItem = selectCurrentPOI(store.getState())

    expect(nextItems).toBeTruthy()
    expect(prevItems).not.toEqual(nextItems)

    expect(nextSelectedItem).toBeTruthy()
    expect(prevSelectedItem).toEqual(nextSelectedItem)
  })

  it(`
    Given POIs have been retrieved from gateway
      And POIs has selected POI uuid
    When user selects a new current POI uuid
    Then prev and next selected POI should be truthy
      And prev and next selected POI should be different
      And selected feed item should be null
  `, async () => {
    const { store, poisGateway, poisEntities } = configureStoreWithSelectedPOIs()

    const prevSelectedItem = selectCurrentPOI(store.getState())

    poisGateway.retrievePOI.resolveDeferredValue()
    store.dispatch(publicActions.setCurrentPOIUuid(Object.keys(poisEntities)[2]))

    poisGateway.retrievePOIs.resolveDeferredValue()
    await store.waitForActionEnd()

    const nextSelectedItem = selectCurrentPOI(store.getState())

    expect(prevSelectedItem).toBeTruthy()
    expect(nextSelectedItem).toBeTruthy()

    expect(prevSelectedItem).not.toEqual(nextSelectedItem)
    expect(selectCurrentFeedItem(store.getState())).toEqual(null)
  })

  it(`
    Given POIs have no cached items
      And has selected POI uuid
    When user sets selected POI uuid
    Then POI should be retrieved from gateway
      And POIs should be retrieved with position of POI
  `, async () => {
    const poisFromGateway = createPOIList()
    const poiDetailsFromGateway = createPOIDetails()

    const deferredValueRetrievePOIs = {
      pois: poisFromGateway,
    }
    const deferredValueRetrievePOI = {
      poiDetails: poiDetailsFromGateway,
    }

    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce(deferredValueRetrievePOIs)
    poisGateway.retrievePOI.mockDeferredValueOnce(deferredValueRetrievePOI)

    const resolveAllDeferredValue = () => {
      poisGateway.retrievePOIs.resolveDeferredValue()
      poisGateway.retrievePOI.resolveDeferredValue()
    }

    const store = configureStoreWithPOIs(
      {
        dependencies: {
          poisGateway,
        },
        initialAppState: {
          pois: {
            ...fakePOIsData,
            pois: {},
            poisUuids: [],
            selectedPOIUuid: null,
            isIdle: true,
          },
        },
      },
    )

    const selectedPOIId = poisFromGateway[0].uuid

    // --------------------------------------------------

    store.dispatch(publicActions.init())
    store.dispatch(publicActions.setCurrentPOIUuid(selectedPOIId))

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOI).toHaveBeenCalledWith({ poiUuid: selectedPOIId })
    expect(poisGateway.retrievePOIs).toHaveBeenCalledWith({
      filters: {
        zoom: calculateDistanceFromZoom(selectLocation(store.getState()).zoom),
        center: {
          lat: poiDetailsFromGateway.latitude,
          lng: poiDetailsFromGateway.longitude,
        },
      },
    })
  })

  it(`
    Given POIs have no cached items
      And has selected POI uuid
    When POI uuid is a city id
    Then POI details should not be retrieved from gateway
      And POIs should not be retrieved
  `, async () => {
    const poisFromGateway = createPOIList()
    const poiDetailsFromGateway = createPOIDetails()

    const deferredValueRetrievePOIs = {
      pois: poisFromGateway,
    }
    const deferredValueRetrievePOI = {
      poiDetails: poiDetailsFromGateway,
    }

    const poisGateway = new TestPOIsGateway()
    poisGateway.retrievePOIs.mockDeferredValueOnce(deferredValueRetrievePOIs)
    poisGateway.retrievePOI.mockDeferredValueOnce(deferredValueRetrievePOI)

    const resolveAllDeferredValue = () => {
      poisGateway.retrievePOIs.resolveDeferredValue()
      poisGateway.retrievePOI.resolveDeferredValue()
    }

    const store = configureStoreWithPOIs(
      {
        dependencies: {
          poisGateway,
        },
        initialAppState: {
          pois: {
            ...fakePOIsData,
            pois: {},
            poisUuids: [],
            selectedPOIUuid: null,
            isIdle: true,
          },
        },
      },
    )

    const selectedPOIId = Object.keys(entourageCities)[0]

    // --------------------------------------------------

    store.dispatch(publicActions.init())
    store.dispatch(publicActions.setCurrentPOIUuid(selectedPOIId))

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(poisGateway.retrievePOI).toHaveBeenCalledTimes(0)
    expect(poisGateway.retrievePOIs).toHaveBeenCalledTimes(0)
  })
})
