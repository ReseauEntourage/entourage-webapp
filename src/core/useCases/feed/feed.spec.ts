import { configureStore } from '../../configureStore'
import { PatialAppDependencies } from '../Dependencies'

import { entitiesSaga, TestApiGateway } from '../entities'
import { createEntourage, createEntourageWithAuthor } from '../mock'
import { PartialAppState, defaultInitialAppState, reducers, AppState } from '../reducers'

import { fakeFeedData } from './__mocks__'
import { publicActions } from './feed.actions'
import { FeedState, defaultFeedState } from './feed.reducer'
import { feedSaga } from './feed.saga'
import {
  selectFeedFilters,
  selectFeedIsFetching,
  selectFeedItems,
  selectHasNextPageToken,
  selectFeedIsIdle,
} from './feed.selectors'

function configureStoreWithFeed(
  params?: {
    dependencies?: PatialAppDependencies;
    initialAppState?: PartialAppState;
  },
) {
  const { initialAppState, dependencies } = params || { }

  return configureStore({
    reducers,
    initialState: {
      ...defaultInitialAppState,
      ...initialAppState,
    },
    dependencies: dependencies || {},
    sagas: [feedSaga, entitiesSaga],
  })
}

describe('Feed', () => {
  it(`
    Given initial state
    When no action is triggered
    Then feed state should be at initial state
  `, () => {
    const store = configureStoreWithFeed()
    expect(store.getState().feed).toEqual(defaultFeedState)
  })

  it(`
    Given user has not any items
    When user set filters
    Then items should be fetching during request
      And items should not be fetching after request succeeded
  `, async () => {
    const apiGateway = new TestApiGateway()
    apiGateway.mockRoute('/feeds GET').mockDeferredValueOnce({
      data: {
        feeds: [],
        nextPageToken: undefined,
      },
    })

    const store = configureStoreWithFeed({ dependencies: { apiGateway } })
    const nextFilters: FeedState['filters'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }
    store.dispatch(publicActions.setFilters(nextFilters))

    expect(selectFeedIsFetching(store.getState())).toEqual(true)

    apiGateway.mockRoute('/feeds GET').resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectFeedIsFetching(store.getState())).toEqual(false)
  })

  it(`
    Given feed request is idle
    When no action is trigger by user
    Then feed request should still be idle
  `, () => {
    const store = configureStoreWithFeed()

    expect(selectFeedIsIdle(store.getState())).toEqual(true)
  })

  it(`
    Given feed request is idle
    When user retrieve feed successfully
    Then feed request should not be idle
  `, async () => {
    const apiGateway = new TestApiGateway()
    apiGateway.mockRoute('/feeds GET').mockDeferredValueOnce({
      data: {
        feeds: [],
      },
    })
    const store = configureStoreWithFeed({ dependencies: { apiGateway } })

    store.dispatch(publicActions.retrieveFeed())

    apiGateway.mockRoute('/feeds GET').resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectFeedIsIdle(store.getState())).toEqual(false)
  })

  it(`
    Given the initial state
    When user want to update all filters
    Then filters should be updated
  `, () => {
    const apiGateway = new TestApiGateway()
    apiGateway.mockRoute('/feeds GET').mockResolvedValue({ data: { feeds: [] } })

    const store = configureStoreWithFeed({ dependencies: { apiGateway } })
    const filters: FeedState['filters'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.setFilters(filters))

    expect(selectFeedFilters(store.getState())).toEqual(filters)
  })

  it(`
    Given the initial state
    When user want to update partially update filters
    Then filters should be updated and merge with existing filters
  `, () => {
    const apiGateway = new TestApiGateway()
    apiGateway.mockRoute('/feeds GET').mockResolvedValue({ data: { feeds: [] } })

    const store = configureStoreWithFeed({ dependencies: { apiGateway } })
    const filters: Partial<FeedState['filters']> = {
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }

    store.dispatch(publicActions.setFilters(filters))

    expect(selectFeedFilters(store.getState())).toEqual({
      ...defaultFeedState.filters,
      ...filters,
    })
  })

  it(`
    Given there is feed items return by the server
    When user retrieve feed for the first time
    Then feed items should be fetching until request is succeeded
      And should retrieve feed successfully with items and next page token
      And should have next page token
      And should pending state be false after server response
      And should retrieve feed gateway method have been called with filters values
  `, async () => {
    const apiGateway = new TestApiGateway()
    const item = createEntourageWithAuthor()
    apiGateway.mockRoute('/feeds GET').mockDeferredValueOnce({
      data: {
        nextPageToken: fakeFeedData.nextPageToken || undefined,
        feeds: [item],
      },
    })
    const store = configureStoreWithFeed({ dependencies: { apiGateway } })

    store.dispatch(publicActions.retrieveFeed({
      filters: store.getState().feed.filters,
      nextPageToken: store.getState().feed.nextPageToken,
    }))

    expect(selectFeedIsFetching(store.getState())).toEqual(true)

    apiGateway.mockRoute('/feeds GET').resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectFeedItems(store.getState())).toEqual([item.data])

    expect(selectHasNextPageToken(store.getState())).toEqual(true)

    expect(selectFeedIsFetching(store.getState())).toEqual(false)

    expect(apiGateway.mockRoute('/feeds GET')).toHaveBeenCalledTimes(1)
    expect(apiGateway.mockRoute('/feeds GET')).toHaveBeenNthCalledWith(1, expect.objectContaining({
      params: expect.objectContaining({
        latitude: defaultFeedState.filters.center.lat,
        longitude: defaultFeedState.filters.center.lng,
      }),
    }))
  })

  it(`
    Given there is feed items return by the server
    When user changes filters
    Then should retrieve feed gateway method have been called the second time with next filters
  `, async () => {
    const apiGateway = new TestApiGateway()
    const item = createEntourageWithAuthor()
    apiGateway.mockRoute('/feeds GET').mockDeferredValueOnce({
      data: {
        nextPageToken: fakeFeedData.nextPageToken || undefined,
        feeds: [item],
      },
    })

    const store = configureStoreWithFeed({ dependencies: { apiGateway } })
    const nextFilters = {
      cityName: 'Lyon',
      center: { lat: 5, lng: 6 },
      zoom: 13,
    }

    store.dispatch(publicActions.setFilters(nextFilters))

    apiGateway.mockRoute('/feeds GET').resolveDeferredValue()
    await store.waitForActionEnd()

    expect(apiGateway.mockRoute('/feeds GET')).toHaveBeenCalledTimes(1)
    expect(apiGateway.mockRoute('/feeds GET')).toHaveBeenNthCalledWith(1, expect.objectContaining({
      params: expect.objectContaining({
        latitude: nextFilters.center.lat,
        longitude: nextFilters.center.lng,
      }),
    }))
  })

  it(`
    Given there is feed items return by the server
    When user fetch the second page and the server return a null next page token
    Then should fetch second page with filters from the store and next page token
      And new items should be concat with previous items
  `, async () => {
    const apiGateway = new TestApiGateway()

    const itemExisted = createEntourageWithAuthor()
    const itemCreated = createEntourageWithAuthor()

    const initialAppState: AppState = {
      ...defaultInitialAppState,
      feed: {
        ...fakeFeedData,
        nextPageToken: 'wyz',
        itemsUuids: [itemExisted.data.uuid],
      },
      entities: {
        ...defaultInitialAppState.entities,
        entourages: {
          [itemExisted.data.uuid]: {
            ...itemExisted,
            data: {
              ...itemExisted.data,
              author: itemExisted.data.author.id,
            },
          },
        },
        users: {
          [itemExisted.data.author.id]: itemExisted.data.author,
        },
      },
    }

    apiGateway.mockRoute('/feeds GET').mockDeferredValueOnce({
      data: {
        feeds: [itemCreated],
      },
    })

    const store = configureStoreWithFeed({ dependencies: { apiGateway }, initialAppState })

    store.dispatch(publicActions.retrieveFeedNextPage())

    apiGateway.mockRoute('/feeds GET').resolveDeferredValue()
    await store.waitForActionEnd()

    expect(apiGateway.mockRoute('/feeds GET')).toHaveBeenCalledTimes(1)
    expect(apiGateway.mockRoute('/feeds GET')).toHaveBeenNthCalledWith(1, expect.objectContaining({
      params: expect.objectContaining({
        latitude: initialAppState.feed.filters.center.lat,
        longitude: initialAppState.feed.filters.center.lng,
        pageToken: 'wyz',
      }),
    }))

    expect(selectFeedItems(store.getState())).toEqual([itemExisted.data, itemCreated.data])
  })

  it(`
    Given next page token is null
    When user want to retrieve next page items
    Then feed items should never be retrieved
      And store should be unchanged
  `, async () => {
    const apiGateway = new TestApiGateway()
    const item = createEntourage()
    const initialAppState: AppState = {
      ...defaultInitialAppState,
      feed: {
        ...fakeFeedData,
        nextPageToken: null,
        itemsUuids: [item.data.uuid],
      },
      entities: {
        ...defaultInitialAppState.entities,
        entourages: {
          [item.data.uuid]: item,
        },
      },
    }

    const store = configureStoreWithFeed({ dependencies: { apiGateway }, initialAppState })
    const previousSelectedFeedItems = selectFeedItems(store.getState())

    store.dispatch(publicActions.retrieveFeedNextPage())

    await store.waitForActionEnd()

    expect(apiGateway.mockRoute('/feeds GET')).toHaveBeenCalledTimes(0)

    expect(selectFeedItems(store.getState())).toEqual(previousSelectedFeedItems)
  })

  it(`
    Given feed items are fetching
    When user want to retrieve feed items
    Then the second request should never start
  `, async () => {
    const apiGateway = new TestApiGateway()
    apiGateway.mockRoute('/feeds GET').mockDeferredValueOnce({
      data: {
        feeds: [],
      },
    })

    const store = configureStoreWithFeed({ dependencies: { apiGateway } })

    store.dispatch(publicActions.retrieveFeed())

    expect(selectFeedIsFetching(store.getState())).toEqual(true)

    store.dispatch(publicActions.retrieveFeed())

    apiGateway.mockRoute('/feeds GET').resolveDeferredValue()
    await store.waitForActionEnd()

    expect(apiGateway.mockRoute('/feeds GET')).toHaveBeenCalledTimes(1)
  })

  it(`
    Given feed items on next page are fetching
    When user want to retrieve next page of feed items
    Then the second request should never start
  `, async () => {
    const apiGateway = new TestApiGateway()
    apiGateway.mockRoute('/feeds GET').mockDeferredValueOnce({
      data: {
        feeds: [],
      },
    })
    const initialAppState: PartialAppState = {
      feed: {
        ...fakeFeedData,
        nextPageToken: 'abc',
      },
    }
    const store = configureStoreWithFeed({ dependencies: { apiGateway }, initialAppState })

    store.dispatch(publicActions.retrieveFeedNextPage())
    store.dispatch(publicActions.retrieveFeedNextPage())

    apiGateway.mockRoute('/feeds GET').resolveDeferredValue()
    await store.waitForActionEnd()

    expect(apiGateway.mockRoute('/feeds GET')).toHaveBeenCalledTimes(1)
  })
})
