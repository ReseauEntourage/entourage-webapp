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

function configureStoreWithSelectedItems() {
  const itemsFromStore = createFeedItemList()
  const itemsFromGateway = createFeedItemList()

  const itemsEntities = itemsFromStore.reduce((acc, item) => ({
    ...acc,
    [item.uuid]: item,
  }), {})

  const feedGateway = new TestFeedGateway()
  feedGateway.retrieveFeedItems.mockDeferredValueOnce({ nextPageToken: null, items: itemsFromGateway })

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
    feedGateway,
    itemsEntities,
  }
}

describe('Feed Item', () => {
  it(`
    Given feed is at initial state
    When no action is triggered,
    Then selected item should be null
  `, () => {
    const store = configureStoreWithFeed({})

    expect(selectCurrentItem(store.getState())).toEqual(null)
  })

  it(`
    Given feed has cached items and selected item to null
    When user select and item
    Then should selected item be defined after to set item uuid
  `, () => {
    const store = configureStoreWithFeed(
      {},
      {
        feed: {
          ...fakeFeedData,
        },
      },
    )

    store.dispatch(publicActions.setCurrentItemUuid('abc'))

    expect(selectCurrentItem(store.getState())).toEqual(fakeFeedData.cacheItems.abc)
  })

  it(`
    Given feed has selected item
    When user fetch new items
    Then items uuid should changes And selected items should never change
  `, async () => {
    const { store, feedGateway } = configureStoreWithSelectedItems()

    const prevItems = selectFeedItems(store.getState())
    const prevSelectedItem = selectCurrentItem(store.getState())

    store.dispatch(publicActions.retrieveFeed())

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForSagaEnd()

    const nextItems = selectFeedItems(store.getState())
    const nextSelectedItem = selectCurrentItem(store.getState())

    expect(nextItems).toBeTruthy()
    expect(prevItems).not.toEqual(nextItems)

    expect(nextSelectedItem).toBeTruthy()
    expect(prevSelectedItem).toEqual(nextSelectedItem)
  })

  it(`
    Given feed has selected item
    When user select a new current item uuid
    Then prev and next selected item should be truthy
      And prev and next selected items should be different
  `, async () => {
    const { store, feedGateway, itemsEntities } = configureStoreWithSelectedItems()

    const prevSelectedItem = selectCurrentItem(store.getState())

    store.dispatch(publicActions.setCurrentItemUuid(Object.keys(itemsEntities)[2]))

    feedGateway.retrieveFeedItems.resolveDeferredValue()
    await store.waitForSagaEnd()

    const nextSelectedItem = selectCurrentItem(store.getState())

    expect(prevSelectedItem).toBeTruthy()
    expect(nextSelectedItem).toBeTruthy()

    expect(prevSelectedItem).not.toEqual(nextSelectedItem)
  })

  it(`
    Given feed has no cached items but a selected item uuid
    When user set selected item uuid
    Then item should be retrieved from gateway
      And feed should be retrieved with position of item
  `, async () => {
    const itemsFromGateway = createFeedItemList()

    const deferredValueRetrieveFeedItems = {
      nextPageToken: null,
      items: itemsFromGateway,
    }
    const deferredValueRetrieveFeedItem = {
      center: {
        lat: 1,
        lng: 2,
      },
      cityName: 'Marseille',
    }

    const feedGateway = new TestFeedGateway()
    feedGateway.retrieveFeedItems.mockDeferredValueOnce(deferredValueRetrieveFeedItems)
    feedGateway.retrieveFeedItem.mockDeferredValueOnce(deferredValueRetrieveFeedItem)
    const resolveAllDeferredValue = () => {
      feedGateway.retrieveFeedItems.resolveDeferredValue()
      feedGateway.retrieveFeedItem.resolveDeferredValue()
    }

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

    const selectedItemUuid = itemsFromGateway[0].uuid

    // --------------------------------------------------

    store.dispatch(publicActions.setCurrentItemUuid(selectedItemUuid))

    resolveAllDeferredValue()
    await store.waitForSagaEnd()

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

  describe('Join entourage', () => {
    function configureStoreWithJoinRequestNotRequested() {
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

      const store = configureStoreWithFeed({ feedGateway }, { feed: defaultFeedDataJoinEntourage })

      return {
        store,
        feedGateway,
      }
    }

    it(`
        Given state has items
          And feed item status is not requested
        When no action is done,
        Then join request should not being sent
          And join status should be not requested
      `, () => {
      const { store } = configureStoreWithJoinRequestNotRequested()

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)

      expect(selectJoinRequestStatus(store.getState(), 'abc')).toEqual(JoinRequestStatus.NOT_REQUEST)
    })

    it(`
        When user want to join an entourage
        Then join request should being sent
          And join entourage gateway method should be called with entourage uuid
          And join request should not being sent after succeeded
          And join request status should be updated
      `, async () => {
      const { store, feedGateway } = configureStoreWithJoinRequestNotRequested()
      const entourageUuid = 'abc'

      feedGateway.joinEntourage.mockDeferredValueOnce({ status: 'accepted' })

      store.dispatch(publicActions.joinEntourage({ entourageUuid }))

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(true)

      expect(feedGateway.joinEntourage).toHaveBeenCalledWith(entourageUuid)

      feedGateway.joinEntourage.resolveDeferredValue()
      await store.waitForSagaEnd()

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)

      expect(selectJoinRequestStatus(store.getState(), 'abc')).toEqual(JoinRequestStatus.ACCEPTED)
    })
  })

  describe('Leave entourage', () => {
    function configureStoreWithItemJoinRequestAccepted() {
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
      feedGateway.leaveEntourage.mockDeferredValueOnce(null)

      const store = configureStoreWithFeed({ feedGateway }, { feed: defaultFeedDataJoinEntourage })

      return {
        store,
        feedGateway,
      }
    }

    it(`
        Given state has items
          And feed item status is accepted
        When no action is triggered
        Then leave request should not being sent
          And join status should be accepted
      `, () => {
      const { store } = configureStoreWithItemJoinRequestAccepted()

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)

      expect(selectJoinRequestStatus(store.getState(), 'abc')).toEqual(JoinRequestStatus.ACCEPTED)
    })

    it(`
        Given state has items
          And feed item status is accepted
        When user want to leave an entourage
        Then leave request should being sent
          And leave entourage gateway should be called with entourage uuid and user id
          And leave request should not being sent after succeeded
          And leave request status should be updated
      `, async () => {
      const { store, feedGateway } = configureStoreWithItemJoinRequestAccepted()
      const entourageUuid = 'abc'

      store.dispatch(publicActions.leaveEntourage({ entourageUuid, userId: 1 }))

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(true)

      expect(feedGateway.leaveEntourage).toHaveBeenCalledWith(entourageUuid, 1)

      feedGateway.leaveEntourage.resolveDeferredValue()
      await store.waitForSagaEnd()

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)

      expect(selectJoinRequestStatus(store.getState(), 'abc')).toEqual(JoinRequestStatus.NOT_REQUEST)
    })
  })
})
