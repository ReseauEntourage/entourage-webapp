import { PreloadedState, StateFromReducersMapObject } from 'redux'
import { configureStore } from '../../configureStore'
import { FeedJoinStatus } from 'src/core/api'
import { TestFeedGateway } from './TestFeedGateway'
import { createFeedItemList, fakeFeedData } from './__mocks__'

import { publicActions } from './feed.actions'
import { feedReducer, JoinRequestStatus } from './feed.reducer'
import { feedSaga } from './feed.saga'
import {
  selectCurrentItem,
  selectFeedItems,
  selectIsUpdatingJoinStatus,
  selectJoinRequestStatus,
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
    sagas: [feedSaga],
    dependencies: {
      ...dependencies,
    },
    initialState,
  })
}

describe('Feed Item', () => {
  describe('Given feed is at initial state', () => {
    const store = configureStoreWithFeed({})

    it('Then selected item should be null', () => {
      expect(selectCurrentItem(store.getState())).toEqual(null)
    })
  })

  describe('Given feed has cached items and selected item to null', () => {
    const store = configureStoreWithFeed(
      {},
      {
        feed: {
          ...fakeFeedData,
        },
      },
    )

    describe('When user select and item', () => {
      store.dispatch(publicActions.setCurrentItemUuid('abc'))

      it('should selected item be defined after to set item uuid', () => {
        expect(selectCurrentItem(store.getState())).toEqual(fakeFeedData.cacheItems.abc)
      })
    })
  })

  describe('Given feed has selected item', () => {
    function configure() {
      const itemsFromStore = createFeedItemList()
      const itemsFromGateway = createFeedItemList()

      const itemsEntities = itemsFromStore.reduce((acc, item) => ({
        ...acc,
        [item.uuid]: item,
      }), {})

      const feedGateway = new TestFeedGateway()
      feedGateway.retrieveFeedItems.mockReturnValue(Promise.resolve({
        nextPageToken: null,
        items: itemsFromGateway,
      }))

      const store = configureStoreWithFeed(
        {
          feedGateway,
        },
        {
          feed: {
            ...fakeFeedData,
            cacheItems: itemsEntities,
            items: Object.keys(itemsEntities),
            selectedItemUuid: Object.keys(itemsEntities)[0],
          },
        },
      )

      return {
        store,
        itemsFromStore,
        itemsFromGateway,
        itemsEntities,
      }
    }

    describe('When user fetch new items', () => {
      const { store } = configure()

      const prevItems = selectFeedItems(store.getState())
      const prevSelectedItem = selectCurrentItem(store.getState())

      store.dispatch(publicActions.retrieveFeed())

      it('Then items uuid should changes And selected items should never change', () => {
        const nextItems = selectFeedItems(store.getState())
        const nextSelectedItem = selectCurrentItem(store.getState())

        expect(nextItems).toBeTruthy()
        expect(prevItems).not.toEqual(nextItems)

        expect(nextSelectedItem).toBeTruthy()
        expect(prevSelectedItem).toEqual(nextSelectedItem)
      })
    })

    describe('When user select a new current item uuid', () => {
      const { store, itemsEntities } = configure()

      const prevSelectedItem = selectCurrentItem(store.getState())
      store.dispatch(publicActions.setCurrentItemUuid(Object.keys(itemsEntities)[2]))
      const nextSelectedItem = selectCurrentItem(store.getState())

      it('Then prev and next selected item should be truthy', () => {
        expect(prevSelectedItem).toBeTruthy()
        expect(nextSelectedItem).toBeTruthy()
      })

      it('Then prev and next selected items should be different', () => {
        expect(prevSelectedItem).not.toEqual(nextSelectedItem)
      })
    })
  })

  describe('Given feed has no cached items but a selected item uuid', () => {
    function configure() {
      const itemsFromStore = createFeedItemList()
      const itemsFromGateway = createFeedItemList()

      const itemsEntities = itemsFromStore.reduce((acc, item) => ({
        ...acc,
        [item.uuid]: item,
      }), {})

      const promiseRetrieveFeedItems = Promise.resolve({
        nextPageToken: null,
        items: itemsFromGateway,
      })

      const promiseRetrieveFeedItem = Promise.resolve({
        center: {
          lat: 1,
          lng: 2,
        },
        cityName: 'Marseille',
      })

      const allPromises = Promise.all([promiseRetrieveFeedItems, promiseRetrieveFeedItem])

      const feedGateway = new TestFeedGateway()
      feedGateway.retrieveFeedItems.mockReturnValue(promiseRetrieveFeedItems)
      feedGateway.retrieveFeedItem.mockResolvedValueOnce(promiseRetrieveFeedItem)

      const store = configureStoreWithFeed(
        {
          feedGateway,
        },
        {
          feed: {
            ...fakeFeedData,
            cacheItems: {},
            items: [],
            selectedItemUuid: null,
          },
        },
      )

      return {
        store,
        itemsFromStore,
        itemsFromGateway,
        itemsEntities,
        feedGateway,
        allPromises,
      }
    }

    describe('When user set selected item uuid', () => {
      const { store, feedGateway, itemsFromGateway, allPromises } = configure()
      const selectedItemUuid = itemsFromGateway[0].uuid

      store.dispatch(publicActions.setCurrentItemUuid(selectedItemUuid))

      it(`
        Then item should be retrieved from gateway
        And feed should be retrieved with position of item
      `, async () => {
        await allPromises

        expect(feedGateway.retrieveFeedItem).toHaveBeenCalledWith({ entourageUuid: selectedItemUuid })
        expect(feedGateway.retrieveFeedItems).toHaveBeenCalledWith({
          filters: {
            zoom: store.getState().feed.filters.zoom,
            center: {
              lat: 1,
              lng: 2,
            },
          },
        })
      })
    })
  })

  describe('Join entourage', () => {
    describe(`
      Given state has items
      And feed item status is not requested
    `, () => {
      function configure() {
        const defaultFeedDataJoinEntourage = {
          ...fakeFeedData,
          cacheItems: {
            ...fakeFeedData.cacheItems,
            abc: {
              ...fakeFeedData.cacheItems.abc,
              joinStatus: 'not_requested' as FeedJoinStatus,
            },
          },
        }

        const feedGateway = new TestFeedGateway()
        const joinRequestPromise = Promise.resolve()
        feedGateway.joinEntourage.mockResolvedValueOnce(joinRequestPromise)

        const store = configureStoreWithFeed({ feedGateway }, { feed: defaultFeedDataJoinEntourage })

        return {
          store,
          feedGateway,
          joinRequestPromise,
        }
      }

      it(`
        When no action is done,
        Then join request should not being send
          And join status should be not requested
      `, () => {
        const { store } = configure()
        expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)
        expect(selectJoinRequestStatus(store.getState(), 'abc')).toEqual(JoinRequestStatus.NOT_REQUEST)
      })

      it(`
        When user want to join an entourage
        Then join request should being send
          And join entourage gateway method be called with entourage uuid
          And join request should not being send after succeeded
          And join request status should be updated
      `, async () => {
        const { store, feedGateway, joinRequestPromise } = configure()
        const entourageUuid = 'abc'
        store.dispatch(publicActions.joinEntourage({ entourageUuid }))

        expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(true)
        expect(feedGateway.joinEntourage).toHaveBeenCalledWith(entourageUuid)

        await joinRequestPromise

        expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)
        expect(selectJoinRequestStatus(store.getState(), 'abc')).toEqual(JoinRequestStatus.PENDING)
      })
    })
  })

  describe('Leave entourage', () => {
    describe(`
      Given state has items
      And feed item status is accepted
    `, () => {
      function configure() {
        const defaultFeedDataJoinEntourage = {
          ...fakeFeedData,
          cacheItems: {
            ...fakeFeedData.cacheItems,
            abc: {
              ...fakeFeedData.cacheItems.abc,
              joinStatus: 'accepted' as FeedJoinStatus,
            },
          },
        }

        const feedGateway = new TestFeedGateway()
        const leaveRequestPromise = Promise.resolve()
        feedGateway.leaveEntourage.mockResolvedValueOnce(leaveRequestPromise)

        const store = configureStoreWithFeed({ feedGateway }, { feed: defaultFeedDataJoinEntourage })

        return {
          store,
          feedGateway,
          leaveRequestPromise,
        }
      }

      it(`
        When no action is done,
        Then leave request should not being send
          And join status should be accepted
      `, () => {
        const { store } = configure()
        expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)
        expect(selectJoinRequestStatus(store.getState(), 'abc')).toEqual(JoinRequestStatus.ACCEPTED)
      })

      it(`
        When user want to leave an entourage
        Then join request should being send
          And leave entourage gateway method be called with entourage uuid and user id
          And leave request should not being send after succeeded
          And leave request status should be updated
      `, async () => {
        const { store, feedGateway, leaveRequestPromise } = configure()
        const entourageUuid = 'abc'
        store.dispatch(publicActions.leaveEntourage({ entourageUuid, userId: 1 }))

        expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(true)
        expect(feedGateway.leaveEntourage).toHaveBeenCalledWith(entourageUuid, 1)

        await leaveRequestPromise

        expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)
        expect(selectJoinRequestStatus(store.getState(), 'abc')).toEqual(JoinRequestStatus.NOT_REQUEST)
      })
    })
  })
})
