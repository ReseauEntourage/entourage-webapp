import { configureStore } from '../../configureStore'
import { PatialAppDependencies } from '../Dependencies'

import { createEntourage, createUser } from '../mock'
import { PartialAppState, defaultInitialAppState, reducers, AppState } from '../reducers'
import { TestFeedGateway } from './TestFeedGateway'
import { fakeFeedData, createFeedItem } from './__mocks__'
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
  params: {
    dependencies?: PatialAppDependencies;
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
    Given user has not any items
    When user set filters
    Then items should be fetching during request
      And items should not be fetching after request succeeded
  `, async () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })
    const nextFilters: FeedState['filters'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }
    store.dispatch(publicActions.setFilters(nextFilters))

    expect(selectFeedIsFetching(store.getState())).toEqual(true)

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectFeedIsFetching(store.getState())).toEqual(false)
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

    store.dispatch(publicActions.retrieveFeed())

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectFeedIsIdle(store.getState())).toEqual(false)
  })

  it(`
    Given the initial state
    When user want to update all filters
    Then filters should be updated
  `, () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockResolvedValue({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })
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
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockResolvedValueOnce({ items: [], nextPageToken: null })
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })
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
    const feedGateway = new TestFeedGateway()
    const item = createFeedItem()
    const deferredValue = { nextPageToken: fakeFeedData.nextPageToken, items: [item] }
    feedGateway.retrieveFeedItems.mockDeferredValueOnce(deferredValue)
    const store = configureStoreWithFeed({ dependencies: { feedGateway } })

    store.dispatch(publicActions.retrieveFeed({
      filters: store.getState().feed.filters,
      nextPageToken: store.getState().feed.nextPageToken,
    }))

    expect(selectFeedIsFetching(store.getState())).toEqual(true)

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectFeedItems(store.getState())).toEqual([item])

    expect(selectHasNextPageToken(store.getState())).toEqual(true)

    expect(selectFeedIsFetching(store.getState())).toEqual(false)

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
    expect(feedGateway.retrieveFeedItems).toHaveBeenNthCalledWith(1, {
      filters: {
        center: defaultFeedState.filters.center,
        zoom: defaultFeedState.filters.zoom,
      },
    })
  })

  it(`
    Given there is feed items return by the server
    When user changes filters
    Then should retrieve feed gateway method have been called the second time with next filters
  `, async () => {
    const feedGateway = new TestFeedGateway()
    const item = createFeedItem()
    const deferredValue = { nextPageToken: fakeFeedData.nextPageToken, items: [item] }
    feedGateway.retrieveFeedItems.mockDeferredValueOnce(deferredValue)

    const store = configureStoreWithFeed({ dependencies: { feedGateway } })
    const nextFilters = {
      cityName: 'Lyon',
      center: { lat: 5, lng: 6 },
      zoom: 13,
    }

    store.dispatch(publicActions.setFilters(nextFilters))

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
    expect(feedGateway.retrieveFeedItems).toHaveBeenNthCalledWith(1, {
      filters: {
        center: nextFilters.center,
        zoom: nextFilters.zoom,
      },
      nextPageToken: undefined,
    })
  })

  it(`
    Given there is feed items return by the server
    When user fetch the second page and the server return a null next page token
    Then should fetch second page with filters from the store and next page token
      And new items should be concat with previous items
  `, async () => {
    const feedGateway = new TestFeedGateway()

    const itemExisted = {
      ...createEntourage(),
      author: createUser(),
    }
    const itemCreated = {
      ...createEntourage(),
      author: createUser(),
    }

    const feedNextData = {
      nextPageToken: null,
      items: [itemCreated],
    }
    feedGateway.retrieveFeedItems.mockDeferredValueOnce(feedNextData)
    const initialAppState: AppState = {
      ...defaultInitialAppState,
      feed: {
        ...fakeFeedData,
        nextPageToken: 'wyz',
        itemsUuids: [itemExisted.uuid],
      },
      entities: {
        ...defaultInitialAppState.entities,
        entourages: {
          [itemExisted.uuid]: {
            ...itemExisted,
            author: itemExisted.author.id,
          },
        },
        users: {
          [itemExisted.author.id]: itemExisted.author,
        },
      },
    }
    const store = configureStoreWithFeed({ dependencies: { feedGateway }, initialAppState })

    store.dispatch(publicActions.retrieveFeedNextPage())

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
    expect(feedGateway.retrieveFeedItems).toHaveBeenNthCalledWith(1, {
      filters: {
        center: initialAppState.feed.filters.center,
        zoom: initialAppState.feed.filters.zoom,
      },
      nextPageToken: 'wyz',
    })

    expect(selectFeedItems(store.getState())).toEqual([itemExisted, itemCreated])
  })

  it(`
    Given next page token is null
    When user want to retrieve next page items
    Then feed items should never be retrieved
      And store should be unchanged
  `, async () => {
    const feedGateway = new TestFeedGateway()
    const item = createEntourage()
    const initialAppState: AppState = {
      ...defaultInitialAppState,
      feed: {
        ...fakeFeedData,
        nextPageToken: null,
        itemsUuids: [item.uuid],
      },
      entities: {
        ...defaultInitialAppState.entities,
        entourages: {
          [item.uuid]: item,
        },
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
})
