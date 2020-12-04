import { PreloadedState, StateFromReducersMapObject } from 'redux'
import { configureStore } from '../../configureStore'
import { TestFeedGateway } from './TestFeedGateway'
import { fakeFeedData } from './__mocks__'
import { publicActions } from './feed.actions'
import { feedReducer, FeedState, defaultFeedState } from './feed.reducer'
import * as sagas from './feed.saga'
import {
  selectFeedFilters,
  selectFeedIsFetching,
  selectFeedItems,
  selectHasNextPageToken,
  selectFeedIsIdle,
} from './feed.selectors'

const reducers = {
  feed: feedReducer,
}

function configureStoreWithFeed(
  dependencies: Parameters<typeof configureStore>[0]['dependencies'],
  initialState?: PreloadedState<StateFromReducersMapObject<typeof reducers>>,
) {
  return configureStore({
    reducers,
    sagas: Object.values(sagas),
    dependencies: {
      ...dependencies,
    },
    initialState,
  })
}

describe('Feed', () => {
  it('should feed be at initial state', () => {
    const feedGateway = new TestFeedGateway()
    const store = configureStoreWithFeed({ feedGateway })
    expect(store.getState().feed).toEqual(defaultFeedState)
  })

  it(`
    Given user has not any items
    When user set filters
    Then items should being fetched during request
      And items should not being fetched after request succeeded
  `, async () => {
    const feedGateway = new TestFeedGateway()
    const promise = Promise.resolve({ items: [], nextPageToken: null })
    feedGateway.retrieveFeedItems.mockReturnValueOnce(promise)
    const store = configureStoreWithFeed({ feedGateway })
    const nextFilters: FeedState['filters'] = {
      cityName: 'Nantes',
      center: { lat: 2, lng: 3 },
      zoom: 12,
    }
    store.dispatch(publicActions.setFilters(nextFilters))

    expect(selectFeedIsFetching(store.getState())).toEqual(true)

    await promise

    expect(selectFeedIsFetching(store.getState())).toEqual(false)
  })

  it(`
    Given feed request is idle
    When no action is trigger by user
    Then feed request should still be idle
  `, () => {
    const feedGateway = new TestFeedGateway()
    const store = configureStoreWithFeed({ feedGateway })

    expect(selectFeedIsIdle(store.getState())).toEqual(true)
  })

  it(`
    Given feed request is idle
    When user retrieve feed successfully
    Then feed request should not be idle
  `, async () => {
    const feedGateway = new TestFeedGateway()
    const promise = Promise.resolve({ items: [], nextPageToken: null })
    feedGateway.retrieveFeedItems.mockReturnValueOnce(promise)
    const store = configureStoreWithFeed({ feedGateway })

    store.dispatch(publicActions.retrieveFeed())

    await promise

    expect(selectFeedIsIdle(store.getState())).toEqual(false)
  })

  it('should update filter successfully with full object', () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockReturnValueOnce(Promise.resolve({
      items: [],
      nextPageToken: null,
    }))

    const store = configureStoreWithFeed({ feedGateway })

    const filters: FeedState['filters'] = {
      cityName: 'Nantes',
      center: {
        lat: 2,
        lng: 3,
      },
      zoom: 12,
    }

    store.dispatch(publicActions.setFilters(filters))

    expect(selectFeedFilters(store.getState())).toEqual(filters)
  })

  it('should update filter successfully with partial object', () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockReturnValueOnce(Promise.resolve({
      items: [],
      nextPageToken: null,
    }))

    const store = configureStoreWithFeed({ feedGateway })

    const filters: Partial<FeedState['filters']> = {
      center: {
        lat: 2,
        lng: 3,
      },
      zoom: 12,
    }

    store.dispatch(publicActions.setFilters(filters))

    expect(selectFeedFilters(store.getState())).toEqual({
      ...defaultFeedState.filters,
      ...filters,
    })
  })

  describe('given user make a feed research', () => {
    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockReturnValue(Promise.resolve({
      nextPageToken: fakeFeedData.nextPageToken,
      items: [fakeFeedData.cacheItems.abc],
    }))

    const store = configureStoreWithFeed({ feedGateway })

    const nextFilters = {
      cityName: 'Lyon',
      center: {
        lat: 5,
        lng: 6,
      },
      zoom: 13,
    }

    describe('when user retrieve feed for the first time', () => {
      it('should show pending state', async () => {
        expect(selectFeedIsFetching(store.getState())).toEqual(false)
        store.dispatch(publicActions.retrieveFeed({
          filters: store.getState().feed.filters,
          nextPageToken: store.getState().feed.nextPageToken,
        }))
        expect(selectFeedIsFetching(store.getState())).toEqual(true)
      })

      it('should retrieve feed successfully with items and next page token', () => {
        expect(selectFeedItems(store.getState())).toEqual([fakeFeedData.cacheItems.abc])
      })

      it('should have next page token', () => {
        expect(selectHasNextPageToken(store.getState())).toEqual(true)
      })

      it('should pending state be false after server response', () => {
        expect(selectFeedIsFetching(store.getState())).toEqual(false)
      })

      it('should retrieve feed gateway method have been called with filters values', () => {
        expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
        expect(feedGateway.retrieveFeedItems).toHaveBeenNthCalledWith(1, {
          filters: {
            center: defaultFeedState.filters.center,
            zoom: defaultFeedState.filters.zoom,
          },
        })
      })
    })

    describe('when user changes filters', () => {
      it('should retrieve feed gateway method have been called the second time with next filters', async () => {
        await store.dispatch(publicActions.setFilters(nextFilters))

        expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(2)
        expect(feedGateway.retrieveFeedItems).toHaveBeenNthCalledWith(2, {
          filters: {
            center: nextFilters.center,
            zoom: nextFilters.zoom,
          },
          nextPageToken: undefined,
        })
      })
    })

    describe('when user fetch the second page and the server return a null next page token', () => {
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
          } as FeedState['cacheItems'][number],
        ],
      }

      it('should fetch second page and concat items', async () => {
        feedGateway.retrieveFeedItems.mockReturnValue(Promise.resolve(feedNextData))
        await store.dispatch(publicActions.retrieveFeedNextPage())

        expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(3)
        expect(feedGateway.retrieveFeedItems).toHaveBeenNthCalledWith(3, {
          filters: {
            center: nextFilters.center,
            zoom: nextFilters.zoom,
          },
          nextPageToken: 'abc',
        })

        expect(selectFeedItems(store.getState())).toEqual([fakeFeedData.cacheItems.abc, feedNextData.items[0]])
      })

      it('should never fetch third page because nextPageToken is null', async () => {
        expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(3)
        await store.dispatch(publicActions.retrieveFeedNextPage())
        expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(3)
      })
    })
  })
})

describe('Feed', () => {
  // it('should retrieve feed gateway method be call only once if there is a pending request', () => {
  //   const feedGateway = new TestFeedGateway()
  //   const fakePromise = new Promise<any>(() => {})
  //   feedGateway.retrieveFeedItems.mockReturnValueOnce(fakePromise)

  //   const store = configureStoreWithFeed({ feedGateway })

  //   store.dispatch(publicActions.retrieveFeed())
  //   store.dispatch(publicActions.retrieveFeed())
  //   expect(feedGateway.retrieveFeedItems).toHaveBeenCalledTimes(1)
  // })

  it('should update item', () => {
    const feedGateway = new TestFeedGateway()

    const store = configureStoreWithFeed({ feedGateway }, { feed: fakeFeedData })

    const firstItem = store.getState().feed.cacheItems.abc

    store.dispatch(publicActions.updateItem({
      uuid: 'abc',
      title: 'feed title updated',
    }))

    const firstItemUpdated = store.getState().feed.cacheItems.abc

    expect(firstItem.title).toEqual('feed title')
    expect(firstItem.description).toEqual('feed description')

    expect(firstItemUpdated.title).toEqual('feed title updated')
    expect(firstItemUpdated.description).toEqual('feed description')
  })
})
