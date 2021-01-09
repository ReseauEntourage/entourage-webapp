import { configureStore } from '../../configureStore'
import { PatialAppDependencies } from '../Dependencies'
import { createEntourage } from '../mock'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'
import { FeedStatus } from 'src/core/api'
import { TestFeedGateway } from './TestFeedGateway'
import { createFeedItemList, fakeFeedData } from './__mocks__'

import { publicActions } from './feed.actions'
import { JoinRequestStatus, RequestStatus } from './feed.reducer'
import { feedSaga } from './feed.saga'
import {
  selectCurrentItem,
  selectFeedItems,
  selectIsUpdatingJoinStatus,
  selectJoinRequestStatus,
  selectIsUpdatingStatus,
  selectStatus,
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
      dependencies: { feedGateway },
      initialAppState: {
        feed: {
          ...fakeFeedData,
          itemsUuids: Object.keys(itemsEntities),
          selectedItemUuid: Object.keys(itemsEntities)[0],
        },
        entities: {
          ...defaultInitialAppState.entities,
          entourages: itemsEntities,
        },
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
    const item = createEntourage()
    const store = configureStoreWithFeed({
      initialAppState: {
        feed: {
          ...fakeFeedData,
        },
        entities: {
          ...defaultInitialAppState.entities,
          entourages: {
            [item.uuid]: item,
          },
        },
      },
    })

    store.dispatch(publicActions.setCurrentItemUuid(item.uuid))

    expect(selectCurrentItem(store.getState())).toEqual(item)
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
    await store.waitForActionEnd()

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
    await store.waitForActionEnd()

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
        dependencies: {
          feedGateway,
        },
        initialAppState: {
          feed: {
            ...fakeFeedData,
            itemsUuids: [],
            selectedItemUuid: null,
          },
        },
      },
    )

    const selectedItemUuid = itemsFromGateway[0].uuid

    // --------------------------------------------------

    store.dispatch(publicActions.setCurrentItemUuid(selectedItemUuid))

    resolveAllDeferredValue()
    await store.waitForActionEnd()

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
      const feedGateway = new TestFeedGateway()

      const item = createEntourage()
      item.joinStatus = 'not_requested'

      const store = configureStoreWithFeed({
        dependencies: { feedGateway },
        initialAppState: {
          feed: {
            ...defaultInitialAppState.feed,
            itemsUuids: [item.uuid],
          },
          entities: {
            ...defaultInitialAppState.entities,
            entourages: {
              [item.uuid]: item,
            },
          },
        },
      })

      return {
        store,
        feedGateway,
        item,
      }
    }

    it(`
        Given state has items
          And feed item status is not requested
        When no action is done,
        Then join request should not be sending
          And join status should be not requested
      `, () => {
      const { store, item } = configureStoreWithJoinRequestNotRequested()

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)

      expect(selectJoinRequestStatus(store.getState(), item.uuid)).toEqual(JoinRequestStatus.NOT_REQUEST)
    })

    it(`
        When user want to join an entourage
        Then join request should be sending
          And join entourage gateway method should be called with entourage uuid
          And join request should not be sending after succeeded
          And join request status should be updated
      `, async () => {
      const { store, feedGateway, item } = configureStoreWithJoinRequestNotRequested()
      const entourageUuid = item.uuid

      feedGateway.joinEntourage.mockDeferredValueOnce({ status: 'accepted' })

      store.dispatch(publicActions.joinEntourage({ entourageUuid }))

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(true)

      expect(feedGateway.joinEntourage).toHaveBeenCalledWith(entourageUuid)

      feedGateway.joinEntourage.resolveDeferredValue()
      await store.waitForActionEnd()

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)

      expect(selectJoinRequestStatus(store.getState(), entourageUuid)).toEqual(JoinRequestStatus.ACCEPTED)
    })
  })

  describe('Leave entourage', () => {
    function configureStoreWithItemJoinRequestAccepted() {
      const feedGateway = new TestFeedGateway()
      feedGateway.leaveEntourage.mockDeferredValueOnce(null)

      const item = createEntourage()
      item.joinStatus = 'accepted'

      const store = configureStoreWithFeed({
        dependencies: { feedGateway },
        initialAppState: {
          feed: {
            ...defaultInitialAppState.feed,
            itemsUuids: [item.uuid],
          },
          entities: {
            ...defaultInitialAppState.entities,
            entourages: {
              [item.uuid]: item,
            },
          },
        },
      })

      return {
        store,
        feedGateway,
        item,
      }
    }

    it(`
        Given state has items
          And feed item status is accepted
        When no action is triggered
        Then leave request should not be sending
          And join status should be accepted
      `, () => {
      const { store, item } = configureStoreWithItemJoinRequestAccepted()

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)

      expect(selectJoinRequestStatus(store.getState(), item.uuid)).toEqual(JoinRequestStatus.ACCEPTED)
    })

    it(`
        Given state has items
          And feed item status is accepted
        When user want to leave an entourage
        Then leave request should be sending
          And leave entourage gateway should be called with entourage uuid and user id
          And leave request should not be sending after succeeded
          And leave request status should be updated
      `, async () => {
      const { store, feedGateway, item } = configureStoreWithItemJoinRequestAccepted()
      const entourageUuid = item.uuid

      store.dispatch(publicActions.leaveEntourage({ entourageUuid, userId: 1 }))

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(true)

      expect(feedGateway.leaveEntourage).toHaveBeenCalledWith(entourageUuid, 1)

      feedGateway.leaveEntourage.resolveDeferredValue()
      await store.waitForActionEnd()

      expect(selectIsUpdatingJoinStatus(store.getState())).toEqual(false)

      expect(selectJoinRequestStatus(store.getState(), entourageUuid)).toEqual(JoinRequestStatus.NOT_REQUEST)
    })
  })

  describe('Status entourage', () => {
    function configureStoreForStatus(status: FeedStatus) {
      const feedGateway = new TestFeedGateway()
      feedGateway.closeEntourage.mockDeferredValueOnce(null)
      feedGateway.reopenEntourage.mockDeferredValueOnce(null)

      const item = createEntourage()
      item.status = status

      const store = configureStoreWithFeed({
        dependencies: { feedGateway },
        initialAppState: {
          feed: {
            ...defaultInitialAppState.feed,
            itemsUuids: [item.uuid],
          },
          entities: {
            ...defaultInitialAppState.entities,
            entourages: {
              [item.uuid]: item,
            },
          },
        },
      })

      return {
        store,
        feedGateway,
        item,
      }
    }

    it(`
      Given state has items
        And feed item status is open
      When no action is triggered
      Then updating status request should not be active
        And status should be open
  `, () => {
      const { store, item } = configureStoreForStatus('open')

      expect(selectIsUpdatingStatus(store.getState())).toEqual(false)

      expect(selectStatus(store.getState(), item.uuid)).toEqual(RequestStatus.OPEN)
    })

    it(`
      Given state has items
        And the one feed item is not close
      When user want to close an entourage
      Then updating status request should be active
        And close entourage gateway should be called with the entourage uuid and the success status
        And updating status request should not be active after succeeded
        And status should be updated to closed
    `, async () => {
      // Given
      const { store, feedGateway, item } = configureStoreForStatus('open')
      const entourageUuid = item.uuid
      const success = true

      // When
      store.dispatch(publicActions.closeEntourage({ entourageUuid, success }))

      // Then
      expect(selectIsUpdatingStatus(store.getState())).toEqual(true)

      expect(feedGateway.closeEntourage).toHaveBeenCalledWith(entourageUuid, success)

      feedGateway.closeEntourage.resolveDeferredValue()
      await store.waitForActionEnd()

      expect(selectIsUpdatingStatus(store.getState())).toEqual(false)
      expect(selectStatus(store.getState(), entourageUuid)).toEqual(RequestStatus.CLOSED)
    })

    it(`
      Given state has items
        And the one feed item is closed
      When user want to reopen an entourage
      Then updating status request should be active
        And reopen entourage gateway should be called with the entourage uuid
        And updating status request should not be active after succeeded
        And status should be updated to open
    `, async () => {
      // Given
      const { store, feedGateway, item } = configureStoreForStatus('closed')
      const entourageUuid = item.uuid

      // When
      store.dispatch(publicActions.reopenEntourage({ entourageUuid }))

      // Then
      expect(selectIsUpdatingStatus(store.getState())).toEqual(true)

      expect(feedGateway.reopenEntourage).toHaveBeenCalledWith(entourageUuid)

      feedGateway.reopenEntourage.resolveDeferredValue()
      await store.waitForActionEnd()

      expect(selectIsUpdatingStatus(store.getState())).toEqual(false)
      expect(selectStatus(store.getState(), entourageUuid)).toEqual(RequestStatus.OPEN)
    })
  })
})
