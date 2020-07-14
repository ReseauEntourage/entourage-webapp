import { InMemoryEntourageGateway } from 'src/adapters/secondary/InMemoryEntourageGateway'
import { createReduxStore } from 'src/store'
import { AnyToFix } from 'src/utils/types'
import { retrieveFeed, retrieveFeedNextPage } from './feed.actions'
import { retrieveFeedEpic, retrieveFeedNextPageEpic } from './feed.epic'
import { feedReducer, initialState } from './feed.reducer'
import { selectFeed, selectFeedFilters } from './feed.selectors'

describe('Feed', () => {
  let store: AnyToFix
  let entourageGateway: InMemoryEntourageGateway

  beforeEach(() => {
    entourageGateway = new InMemoryEntourageGateway()

    store = createReduxStore({
      dependencies: {
        entourageGateway,
      },
      reducers: {
        feed: feedReducer,
      },
      epics: [
        retrieveFeedEpic,
        retrieveFeedNextPageEpic,
      ],
    })
  })

  it('should feed be at initial state', () => {
    expect(store.getState()).toEqual({
      feed: initialState,
    })
  })

  it('should show pending state', () => {
    entourageGateway.delayResponse = 1000

    entourageGateway.feed = {
      nextPageToken: 'abc',
      items: [
        {
          author: {
            avatarUrl: 'http://image.com',
          },
          createdAt: new Date().toISOString(),
          description: 'feed description',
          id: 'feed id',
          title: 'feed title',
        },
      ],
    }

    store.dispatch(retrieveFeed())

    expect(store.getState()).toEqual({
      feed: {
        ...initialState,
        fetching: true,
      },
    })
  })

  it('should retrieve feed successfully', () => {
    const feed = {
      nextPageToken: 'abc',
      items: [
        {
          author: {
            avatarUrl: 'http://image.com',
          },
          createdAt: new Date().toISOString(),
          description: 'feed description',
          id: 'feed id',
          title: 'feed title',
        },
      ],
    }

    entourageGateway.feed = feed

    store.dispatch(retrieveFeed())

    expect(store.getState()).toEqual({
      feed: {
        ...initialState,
        fetching: false,
        nextPageToken: feed.nextPageToken,
        items: feed.items,
      },
    })

    expect(selectFeed(store.getState())).toEqual(feed.items)

    entourageGateway.retrieveFeed = jest.fn(entourageGateway.retrieveFeed)

    store.dispatch(retrieveFeed({
      center: {
        lat: 1,
        lng: 1,
      },
      zoom: 1,
    }))

    expect(entourageGateway.retrieveFeed).toHaveBeenCalledWith({
      center: {
        lat: 1,
        lng: 1,
      },
      zoom: 1,
    }, null)

    expect(store.getState()).toEqual({
      feed: {
        ...initialState,
        fetching: false,
        nextPageToken: feed.nextPageToken,
        items: feed.items,
        filters: {
          ...initialState.filters,
          center: {
            lat: 1,
            lng: 1,
          },
          zoom: 1,
        },
      },
    })
  })

  it('sould select feed filters', () => {
    expect(selectFeedFilters(store.getState())).toEqual(initialState.filters)
  })

  it('should show pending state when fetching next page', () => {
    entourageGateway.feed = {
      nextPageToken: 'abc',
      items: [],
    }

    store.dispatch(retrieveFeed())

    expect(store.getState()).toEqual({
      feed: {
        ...initialState,
        nextPageToken: 'abc',
      },
    })

    entourageGateway.delayResponse = 1000

    store.dispatch(retrieveFeedNextPage())

    expect(store.getState()).toEqual({
      feed: {
        ...initialState,
        nextPageToken: 'abc',
        fetching: true,
      },
    })
  })

  it('should fetch next page', () => {
    const feedPage1 = {
      nextPageToken: 'abc',
      items: [
        {
          author: {
            avatarUrl: 'http://image.com',
          },
          createdAt: new Date().toISOString(),
          description: 'feed description',
          id: 'feed id',
          title: 'feed title',
        },
      ],
    }

    const feedPage2 = {
      nextPageToken: null,
      items: [
        {
          author: {
            avatarUrl: 'http://image.com page 2',
          },
          createdAt: new Date().toISOString(),
          description: 'feed description page 2',
          id: 'feed id page 2',
          title: 'feed title page 2',
        },
      ],
    }

    entourageGateway.feed = feedPage1

    store.dispatch(retrieveFeed())

    entourageGateway.feed = feedPage2

    entourageGateway.retrieveFeed = jest.fn(entourageGateway.retrieveFeed)

    store.dispatch(retrieveFeedNextPage())

    expect(entourageGateway.retrieveFeed).toHaveBeenCalledWith(initialState.filters, 'abc')

    expect(store.getState()).toEqual({
      feed: {
        ...initialState,
        fetching: false,
        nextPageToken: null,
        items: [
          ...feedPage1.items,
          ...feedPage2.items,
        ],
      },
    })
  })

  it('shouldn\'t trigger retrieve feed next page if there is no next page token', () => {
    const feed = {
      nextPageToken: null,
      items: [
        {
          author: {
            avatarUrl: 'http://image.com',
          },
          createdAt: new Date().toISOString(),
          description: 'feed description',
          id: 'feed id',
          title: 'feed title',
        },
      ],
    }

    entourageGateway.feed = feed

    store.dispatch(retrieveFeed())

    entourageGateway.retrieveFeed = jest.fn(entourageGateway.retrieveFeed)

    store.dispatch(retrieveFeedNextPage())

    expect(entourageGateway.retrieveFeed).toHaveBeenCalledTimes(0)

    expect(store.getState()).toEqual({
      feed: {
        ...initialState,
        fetching: false,
        nextPageToken: null,
        items: feed.items,
      },
    })
  })
})
