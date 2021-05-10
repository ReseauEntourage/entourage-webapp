import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { authUserActions } from '../authUser'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'
import { TestMessagesGateway } from './TestMessagesGateway'
import { fakeMessagesData } from './__mocks__'

import { publicActions } from './messages.actions'
import { defaultMessagesState } from './messages.reducer'
import { messagesSaga } from './messages.saga'
import {
  selectConversationList,
  selectMessagesCurrentPage,
  selectMessagesIsFetching, selectMessagesIsIdle,

} from './messages.selectors'

function configureStoreWithMessages(
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
    sagas: [messagesSaga],
  })
}

describe('Messages', () => {
  it(`
    Given initial state
    When no action is triggered
    Then messages state should be at initial state
  `, () => {
    const messagesGateway = new TestMessagesGateway()
    const store = configureStoreWithMessages({ dependencies: { messagesGateway } })
    expect(store.getState().messages).toEqual(defaultMessagesState)
  })

  it(`
    Given messages request is idle
    When user retrieve messages successfully
    Then messages should not be idle
  `, async () => {
    const messagesGateway = new TestMessagesGateway()
    messagesGateway.retrieveConversations.mockDeferredValueOnce({ conversations: [] })
    const store = configureStoreWithMessages({ dependencies: { messagesGateway } })

    store.dispatch(publicActions.retrieveConversations())

    messagesGateway.retrieveConversations.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectMessagesIsIdle(store.getState())).toEqual(false)
  })

  it(`
    Given there is messages returned by the server
    When user retrieve messages for the first time
    Then messages should be fetching until request is succeeded
      And should retrieve messages successfully with items
      And should fetching state be false after server response
      And should retrieve messages gateway method have been called with default page number
  `, async () => {
    const messagesGateway = new TestMessagesGateway()
    const deferredValue = { conversations: [fakeMessagesData.conversations.abc] }
    messagesGateway.retrieveConversations.mockDeferredValueOnce(deferredValue)
    const store = configureStoreWithMessages({ dependencies: { messagesGateway } })

    store.dispatch(publicActions.retrieveConversations())

    expect(selectMessagesIsFetching(store.getState())).toEqual(true)

    messagesGateway.retrieveConversations.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectConversationList(store.getState())).toEqual([fakeMessagesData.conversations.abc])
    expect(selectMessagesIsFetching(store.getState())).toEqual(false)

    expect(messagesGateway.retrieveConversations).toHaveBeenCalledTimes(1)
    expect(messagesGateway.retrieveConversations).toHaveBeenNthCalledWith(1, {
      page: 0,
    })
  })

  it(`
    Given there is messages returned by the server
    When user retrieve next page of messages
    Then messages should be fetching until request is succeeded
      And should retrieve messages successfully with items
      And should fetching state be false after server response
      And page number should be incremented
      And should retrieve messages gateway method have been called with next page number
  `, async () => {
    const messagesGateway = new TestMessagesGateway()
    const deferredValue = { conversations: [fakeMessagesData.conversations.def] }
    messagesGateway.retrieveConversations.mockDeferredValueOnce(deferredValue)
    const store = configureStoreWithMessages({ dependencies: { messagesGateway },
      initialAppState: {
        ...defaultInitialAppState,
        messages: {
          ...defaultMessagesState,
          conversationsUuids: ['abc'],
          conversations: {
            abc: fakeMessagesData.conversations.abc,
          },
        },
      },
    })

    store.dispatch(publicActions.retrieveNextConversations())

    expect(selectMessagesIsFetching(store.getState())).toEqual(true)

    messagesGateway.retrieveConversations.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectConversationList(store.getState())).toEqual(
      [
        fakeMessagesData.conversations.abc,
        fakeMessagesData.conversations.def,
      ],
    )
    expect(selectMessagesIsFetching(store.getState())).toEqual(false)
    expect(selectMessagesCurrentPage(store.getState())).toEqual(1)

    expect(messagesGateway.retrieveConversations).toHaveBeenCalledTimes(1)
    expect(messagesGateway.retrieveConversations).toHaveBeenNthCalledWith(1, {
      page: 1,
    })
  })

  it(`
    Given there is messages returned by the server
    When user retrieve next page of messages
      And next page of messages is empty
    Then messages should be fetching until request is succeeded
      And should retrieve messages successfully with no items
      And should fetching state be false after server response
      And page number should not be incremented
      And should retrieve messages gateway method have been called with next page number
  `, async () => {
    const messagesGateway = new TestMessagesGateway()
    messagesGateway.retrieveConversations.mockDeferredValueOnce({ conversations: [] })
    const store = configureStoreWithMessages({ dependencies: { messagesGateway } })

    store.dispatch(publicActions.retrieveNextConversations())

    expect(selectMessagesIsFetching(store.getState())).toEqual(true)

    expect(selectMessagesCurrentPage(store.getState())).toEqual(1)

    store.dispatch(publicActions.retrieveNextConversations())

    messagesGateway.retrieveConversations.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(messagesGateway.retrieveConversations).toHaveBeenNthCalledWith(1, {
      page: 1,
    })

    expect(selectMessagesCurrentPage(store.getState())).toEqual(0)
  })

  it(`
    Given messages are fetching
    When user want to retrieve messages
    Then the second request should never start
  `, async () => {
    const messagesGateway = new TestMessagesGateway()
    messagesGateway.retrieveConversations.mockDeferredValueOnce({ conversations: [fakeMessagesData.conversations.abc] })

    const store = configureStoreWithMessages({ dependencies: { messagesGateway } })

    store.dispatch(publicActions.retrieveConversations())

    expect(selectMessagesIsFetching(store.getState())).toEqual(true)

    store.dispatch(publicActions.retrieveConversations())

    messagesGateway.retrieveConversations.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(messagesGateway.retrieveConversations).toHaveBeenCalledTimes(1)
  })

  it(`
    Given messages are fetching
    When user want to retrieve next page of messages
    Then the second request should never start
      And the page number should not be incremented
  `, async () => {
    const messagesGateway = new TestMessagesGateway()
    messagesGateway.retrieveConversations.mockDeferredValueOnce({ conversations: [fakeMessagesData.conversations.def] })

    const store = configureStoreWithMessages({ dependencies: { messagesGateway } })

    store.dispatch(publicActions.retrieveNextConversations())

    expect(selectMessagesIsFetching(store.getState())).toEqual(true)

    expect(selectMessagesCurrentPage(store.getState())).toEqual(1)

    store.dispatch(publicActions.retrieveNextConversations())

    messagesGateway.retrieveConversations.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(messagesGateway.retrieveConversations).toHaveBeenCalledTimes(1)

    expect(selectMessagesCurrentPage(store.getState())).toEqual(1)
  })

  it(`
      Given initial state
      When user logs out
        And user is set to null
      Then messages state should go back to default value
      `, async () => {
    const messagesGateway = new TestMessagesGateway()
    const store = configureStoreWithMessages({
      dependencies: { messagesGateway },
      initialAppState: {
        ...defaultInitialAppState,
        messages: fakeMessagesData,
      },
    })
    store.dispatch(authUserActions.setUser(null))
    await store.waitForActionEnd()

    expect(store.getState().messages).toEqual(defaultMessagesState)
  })
})
