import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { locationActions, LocationState, selectPosition } from '../location'
import { fakeLocationData } from '../location/__mocks__'
import { defaultLocationState } from '../location/location.reducer'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'
import { FilterEntourageType, FilterFeedCategory } from 'src/utils/types'
import { TestFeedGateway } from './TestFeedGateway'
import { fakeFeedData } from './__mocks__'
import { publicActions } from './feed.actions'
import { FeedState, defaultFeedState } from './feed.reducer'
import { feedSaga } from './feed.saga'
import {
  selectFeedIsFetching,
  selectFeedItems,
  selectHasNextPageToken,
  selectFeedIsIdle,
  selectFeedFilters,
} from './feed.selectors'

function configureStoreWithFeed(
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
    sagas: [feedSaga],
  })
}

describe('Feed', () => {
  it(`
    Given initial state
    When no action is triggered
    Then feed state should be at initial state
  `, () => {
    const feedGateway = new TestFeedGateway()
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })
    expect(store.getState().feed).toEqual(defaultFeedState)
  })

  it(`
    Given initial state
     When user hasn't init feed
      And user sets position filters
    Then items should not be fetched
  `, async () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })
    const nextLocation: LocationState['position'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }
    store.dispatch(locationActions.setPosition(nextLocation))

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(0)
  })

  it(`
    Given initial state
    When user init feed
      And user sets position filters
    Then items should be fetched
  `, async () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })
    const nextLocation: LocationState['position'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.init())

    store.dispatch(locationActions.setPosition(nextLocation))

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
  })

  it(`
    Given initial state
    When user init feed
      And user set position filters
      And user cancels feed
      And user sets a new position filter again
    Then items should be fetched only once
  `, async () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })
    const nextLocation: LocationState['position'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }
    store.dispatch(publicActions.init())

    store.dispatch(locationActions.setPosition(nextLocation))

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    store.dispatch(publicActions.cancel())

    const nextNextLocation: LocationState['position'] = {
      cityName: 'Nantes',
      center: { lat: 5, lng: 6 },
      zoom: 65,
    }

    store.dispatch(locationActions.setPosition(nextNextLocation))

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
    expect(selectPosition(store.getState())).toStrictEqual(nextNextLocation)
  })

  it(`
    Given user has not any items
    When user set position filters
    Then items should be fetching during request
      And items should not be fetching after request succeeded
  `, async () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })
    const nextLocation: LocationState['position'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.init())
    store.dispatch(locationActions.setPosition(nextLocation))

    expect(selectFeedIsFetching(store.getState())).toEqual(true)

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectFeedIsFetching(store.getState())).toEqual(false)
  })

  it(`
  Given initial state
   When user hasn't init feed
    And user sets position filters
  Then items should not be fetched
`, async () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })

    store.dispatch(publicActions.toggleFeedFilter({
      type: FilterEntourageType.CONTRIBUTION,
      category: FilterFeedCategory.OTHER,
    }))

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(0)
  })

  it(`
    Given initial state
    When user init feed
      And user toogle feed filters
    Then store should be update with new feed filters values
    And items should be fetched
    And should retrieve feed gateway method have been called with feed filters values
  `, async () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })

    store.dispatch(publicActions.init())

    store.dispatch(publicActions.toggleFeedFilter({
      type: FilterEntourageType.CONTRIBUTION,
      category: FilterFeedCategory.OTHER,
    }))

    const expectedFeedFilters = {
      ...defaultFeedState.filters,
      [FilterEntourageType.CONTRIBUTION]: [
        FilterFeedCategory.MAT_HELP,
        FilterFeedCategory.RESOURCE,
        FilterFeedCategory.SOCIAL,
      ],
    }

    expect(selectFeedFilters(store.getState())).toEqual(expectedFeedFilters)

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledWith({
      filters: {
        position: {
          center: defaultLocationState.position.center,
          zoom: defaultLocationState.position.zoom,
        },
        types: expectedFeedFilters,
      },
      nextPageToken: undefined,
    })
  })

  it(`
    Given initial state
    When user init feed
      And user set feed filters
      And user cancels feed
      And user sets a new feed filter again
    Then items should be fetched only once
  `, async () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })
    const expectedFeedFilters = {
      ...defaultFeedState.filters,
      [FilterEntourageType.CONTRIBUTION]: [
        FilterFeedCategory.MAT_HELP,
        FilterFeedCategory.RESOURCE,
      ],
    }

    store.dispatch(publicActions.init())

    store.dispatch(publicActions.toggleFeedFilter({
      type: FilterEntourageType.CONTRIBUTION,
      category: FilterFeedCategory.OTHER,
    }))

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    store.dispatch(publicActions.cancel())

    store.dispatch(publicActions.toggleFeedFilter({
      type: FilterEntourageType.CONTRIBUTION,
      category: FilterFeedCategory.SOCIAL,
    }))

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
    expect(selectFeedFilters(store.getState())).toStrictEqual(expectedFeedFilters)
  })

  it(`
    Given feed request is idle
    When no action is trigger by user
    Then feed request should still be idle
  `, () => {
    const feedGateway = new TestFeedGateway()
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })

    expect(selectFeedIsIdle(store.getState())).toEqual(true)
  })

  it(`
    Given feed request is idle
    When user retrieve feed successfully
    Then feed request should not be idle
  `, async () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })

    store.dispatch(publicActions.init())
    store.dispatch(publicActions.retrieveFeed())

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectFeedIsIdle(store.getState())).toEqual(false)
  })

  it(`
    Given there is feed items return by the server
    When user retrieve feed for the first time
    Then feed items should be fetching until request is succeeded
      And should retrieve feed successfully with items and next page token
      And should have next page token
      And should pending state be false after server response
      And should retrieve feed gateway method have been called with position filters values
  `, async () => {
    const feedGateway = new TestFeedGateway()
    const deferredValue = { nextPageToken: fakeFeedData.nextPageToken, items: [fakeFeedData.items.abc] }
    feedGateway.retrieveFeedItems.mockDeferredValueOnce(deferredValue)
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })

    store.dispatch(publicActions.init())
    store.dispatch(publicActions.retrieveFeed())

    expect(selectFeedIsFetching(store.getState())).toEqual(true)

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectFeedItems(store.getState())).toEqual([fakeFeedData.items.abc])

    expect(selectHasNextPageToken(store.getState())).toEqual(true)

    expect(selectFeedIsFetching(store.getState())).toEqual(false)

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
    expect(feedGateway.retrieveFeedItems).toHaveBeenNthCalledWith(1, {
      filters: {
        position: {
          center: defaultLocationState.position.center,
          zoom: defaultLocationState.position.zoom,
        },
        types: defaultFeedState.filters,
      },
    })
  })

  it(`
    Given there is feed items return by the server
    When user changes position filters
    Then should retrieve feed gateway method have been called the second time with next position filters
  `, async () => {
    const feedGateway = new TestFeedGateway()
    const deferredValue = { nextPageToken: fakeFeedData.nextPageToken, items: [fakeFeedData.items.abc] }
    feedGateway.retrieveFeedItems.mockDeferredValueOnce(deferredValue)

    const store = configureStoreWithFeed({ dependencies: { feedGateway } })
    const nextLocation = {
      cityName: 'Lyon',
      center: { lat: 5, lng: 6 },
      zoom: 13,
    }

    store.dispatch(publicActions.init())
    store.dispatch(locationActions.setPosition(nextLocation))

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
    expect(feedGateway.retrieveFeedItems).toHaveBeenNthCalledWith(1, {
      filters: {
        position: {
          center: nextLocation.center,
          zoom: nextLocation.zoom,
        },
        types: defaultFeedState.filters,
      },
      nextPageToken: undefined,
    })
  })

  it(`
    Given there is feed items return by the server
    When user fetch the second page and the server return a null next page token
    Then should fetch second page with position filters from the store and next page token
      And new items should be concat with previous items
  `, async () => {
    const feedGateway = new TestFeedGateway()
    const feedNextData = {
      nextPageToken: null,
      items: [
        {
          author: {
            avatarUrl: 'http://image-2.com',
            displayName: 'Jane',
            id: 1,
          },
          createdAt: new Date().toISOString(),
          description: 'feed description page 2',
          id: 2,
          uuid: '2',
          title: 'feed title page 2',
          location: {
            latitude: 2,
            longitude: 2,
          },
          metadata: {},
        } as FeedState['items'][number],
      ],
    }
    feedGateway.retrieveFeedItems.mockDeferredValueOnce(feedNextData)
    const initialAppState = {
      feed: {
        ...fakeFeedData,
        nextPageToken: 'wyz',
      },
      location: {
        ...fakeLocationData,
      },
    }
    const store = configureStoreWithFeed({ dependencies: { feedGateway }, initialAppState })

    store.dispatch(publicActions.init())
    store.dispatch(publicActions.retrieveFeedNextPage())

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
    expect(feedGateway.retrieveFeedItems).toHaveBeenNthCalledWith(1, {
      filters: {
        position: {
          center: initialAppState.location.position.center,
          zoom: initialAppState.location.position.zoom,
        },
        types: defaultFeedState.filters,
      },
      nextPageToken: 'wyz',
    })

    expect(selectFeedItems(store.getState())).toEqual([fakeFeedData.items.abc, feedNextData.items[0]])
  })

  it(`
    Given next page token is null
    When user want to retrieve next page items
    Then feed items should never be retrieved
      And store should be unchanged
  `, async () => {
    const feedGateway = new TestFeedGateway()
    const initialAppState = {
      feed: {
        ...fakeFeedData,
        nextPageToken: null,
      },
    }
    const store = configureStoreWithFeed({ dependencies: { feedGateway }, initialAppState })
    const previousSelectedFeedItems = selectFeedItems(store.getState())

    store.dispatch(publicActions.retrieveFeedNextPage())

    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(0)

    expect(selectFeedItems(store.getState())).toEqual(previousSelectedFeedItems)
  })

  it(`
    Given feed items are fetching
    When user want to retrieve feed items
    Then the second request should never start
  `, async () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })

    store.dispatch(publicActions.retrieveFeed())

    expect(selectFeedIsFetching(store.getState())).toEqual(true)

    store.dispatch(publicActions.retrieveFeed())

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
  })

  it(`
    Given feed items on next page are fetching
    When user want to retrieve next page of feed items
    Then the second request should never start
  `, async () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })
    const initialAppState: PartialAppState = {
      feed: {
        ...fakeFeedData,
        nextPageToken: 'abc',
      },
    }
    const store = configureStoreWithFeed({ dependencies: { feedGateway }, initialAppState })

    store.dispatch(publicActions.retrieveFeedNextPage())
    store.dispatch(publicActions.retrieveFeedNextPage())

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
  })

  it(`
    Given store has items
    When user want to partially update an item that is not undefined
    Then item should be partially updated
  `, () => {
    const feedGateway = new TestFeedGateway()
    const initialAppState: PartialAppState = {
      feed: fakeFeedData,
    }
    const store = configureStoreWithFeed({ dependencies: { feedGateway }, initialAppState })
    const firstItem = store.getState().feed.items.abc

    store.dispatch(publicActions.updateItem({
      uuid: 'abc',
      title: 'feed title updated',
    }))

    const firstItemUpdated = store.getState().feed.items.abc

    expect(firstItem.title).toEqual('feed title')
    expect(firstItem.description).toEqual('feed description')

    expect(firstItemUpdated.title).toEqual('feed title updated')
    expect(firstItemUpdated.description).toEqual('feed description')
  })
})
