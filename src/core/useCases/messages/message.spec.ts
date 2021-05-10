import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { createUser } from '../authUser/__mocks__'
import { defaultAuthUserState } from '../authUser/authUser.reducer'
import { selectCurrentFeedItem } from '../feed'
import {
  selectLocation,
  selectLocationIsInit,
  locationSaga,
  selectMapPosition,
} from '../location'
import { defaultLocationState } from '../location/location.reducer'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'
import { constants } from 'src/constants'
import { Cities, EntourageCities } from 'src/utils/types'
import { TestMessagesGateway } from './TestMessagesGateway'
import {
  createConversationItem,
  createConversationList,
  createConversationMessages,
  fakeMessagesData,
} from './__mocks__'

import { publicActions } from './messages.actions'
import { messagesSaga } from './messages.saga'
import {
  selectConversationList,
  selectCurrentConversation,
  selectConversationMessagesIsFetching, selectCanFetchMoreMessages, selectCurrentConversationMessages,
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

function configureStoreWithSelectedMessages() {
  const conversationsFromStore = createConversationList()
  const conversationsFromGateway = createConversationList()

  const conversationsEntities = conversationsFromStore.reduce((acc, item) => ({
    ...acc,
    [item.uuid]: item,
  }), {})

  const conversationMessagesFromStore = {
    [Object.keys(conversationsEntities)[0]]: createConversationMessages(),
  }

  const conversationMessagesFromGateway = createConversationMessages()

  const messagesGateway = new TestMessagesGateway()
  messagesGateway.retrieveConversations.mockDeferredValueOnce({ conversations: conversationsFromGateway })
  messagesGateway.retrieveConversationMessages.mockDeferredValueOnce(
    { conversationMessages: conversationMessagesFromGateway },
  )

  const store = configureStoreWithMessages(
    {
      dependencies: { messagesGateway },
      initialAppState: {
        messages: {
          ...fakeMessagesData,
          conversations: conversationsEntities,
          conversationsUuids: Object.keys(conversationsEntities),
          selectedConversationUuid: Object.keys(conversationsEntities)[0],
          conversationsMessages: conversationMessagesFromStore,
          isIdle: false,
        },
      },
    },
  )

  return {
    store,
    messagesGateway,
    conversationsEntities,
  }
}

describe('Messages', () => {
  it(`
    Given messages are at initial state
    When no action is triggered,
    Then selected conversation should be null
  `, () => {
    const store = configureStoreWithMessages({})

    expect(selectCurrentConversation(store.getState())).toEqual(null)
  })

  it(`
    Given messages have been retrieved from gateway
    When user selects a conversation that has never been selected before
    Then conversation messages should be fetching until request is succeeded
      And conversation messages should be retrieved successfully from gateway
      And selected conversation be defined with these conversation messages
      And messages fetching state be false after server response
  `, async () => {
    const messagesGateway = new TestMessagesGateway()

    const store = configureStoreWithMessages({
      dependencies: { messagesGateway },
      initialAppState: {
        messages: {
          ...fakeMessagesData,
          isIdle: false,
        },
      },
    })
    const conversationMessagesFromGateway = [
      ...createConversationMessages(),
    ]

    const deferredValueRetrieveConversations = {
      conversationMessages: conversationMessagesFromGateway,
    }

    const selectedConversationId = 'abc'

    messagesGateway.retrieveConversationMessages.mockDeferredValueOnce(deferredValueRetrieveConversations)
    messagesGateway.retrieveConversationMessages.resolveDeferredValue()

    store.dispatch(publicActions.setCurrentConversationUuid(selectedConversationId))
    expect(selectConversationMessagesIsFetching(store.getState())).toEqual(true)

    await store.waitForActionEnd()

    expect(messagesGateway.retrieveConversationMessages).toHaveBeenCalledWith({ entourageUuid: selectedConversationId })

    expect(selectCurrentConversation(store.getState())).toEqual(conversationMessagesFromGateway)
    expect(selectConversationMessagesIsFetching(store.getState())).toEqual(false)

    expect(selectCurrentFeedItem(store.getState())).toEqual(null)
  })

  it(`
    Given messages have been retrieved from gateway
    When user selects a conversation that has already been selected before
    Then conversation should not be retrieved from gateway
      And selected conversation be defined with these conversation messages
  `, async () => {
    const messagesGateway = new TestMessagesGateway()
    const conversationMessagesFromGateway = createConversationMessages()

    const store = configureStoreWithMessages({
      dependencies: { messagesGateway },
      initialAppState: {
        messages: {
          ...fakeMessagesData,
          selectedConversationUuid: 'abc',
          conversationsMessages: {
            abc: conversationMessagesFromGateway,
          },
          isIdle: false,
        },
      },
    })

    const deferredValueRetrieveConversations = {
      conversationMessages: createConversationMessages(),
    }

    messagesGateway.retrieveConversationMessages.mockDeferredValueOnce(deferredValueRetrieveConversations)
    messagesGateway.retrieveConversationMessages.resolveDeferredValue()

    await store.waitForActionEnd()

    expect(messagesGateway.retrieveConversationMessages).toHaveBeenCalledTimes(0)

    expect(selectCurrentConversation(store.getState())).toEqual(conversationMessagesFromGateway)

    expect(selectCurrentFeedItem(store.getState())).toEqual(null)
  })

  it(`
    Given messages have been retrieved from gateway
      And messages has selected conversation uuid
    When user fetch new messages
    Then messages should changes
      And selected item should never change
  `, async () => {
    const { store, messagesGateway } = configureStoreWithSelectedMessages()

    const prevItems = selectConversationList(store.getState())
    const prevSelectedItem = selectCurrentConversation(store.getState())

    store.dispatch(publicActions.retrieveConversations())

    messagesGateway.retrieveConversations.resolveDeferredValue()
    await store.waitForActionEnd()

    const nextItems = selectConversationList(store.getState())
    const nextSelectedItem = selectCurrentConversation(store.getState())

    expect(nextItems).toBeTruthy()
    expect(prevItems).not.toEqual(nextItems)

    expect(nextSelectedItem).toBeTruthy()
    expect(prevSelectedItem).toEqual(nextSelectedItem)
  })

  it(`
    Given messages have been retrieved from gateway
      And messages has selected conversation uuid
    When user selects a new current conversation uuid
    Then prev and next selected conversation should be truthy
      And prev and next selected conversation should be different
  `, async () => {
    const { store, messagesGateway, conversationsEntities } = configureStoreWithSelectedMessages()

    const prevSelectedItem = selectCurrentConversation(store.getState())

    messagesGateway.retrieveConversationMessages.resolveDeferredValue()
    messagesGateway.retrieveConversations.resolveDeferredValue()

    store.dispatch(publicActions.setCurrentConversationUuid(Object.keys(conversationsEntities)[2]))

    await store.waitForActionEnd()

    const nextSelectedItem = selectCurrentConversation(store.getState())

    expect(prevSelectedItem).toBeTruthy()
    expect(nextSelectedItem).toBeTruthy()

    expect(prevSelectedItem).not.toEqual(nextSelectedItem)
    expect(selectCurrentFeedItem(store.getState())).toEqual(null)
  })

  it(`
    Given messages have not been retrieved from gateway
      And has selected conversation uuid
    When user sets selected conversation uuid
    Then conversation should be retrieved from gateway
  `, async () => {
    const conversationsFromGateway = createConversationList()
    const conversationMessagesFromGateway = createConversationMessages()

    const deferredValueRetrieveConversations = {
      conversations: conversationsFromGateway,
    }
    const deferredValueRetrieveConversationMessages = {
      conversationMessages: conversationMessagesFromGateway,
    }

    const messagesGateway = new TestMessagesGateway()
    messagesGateway.retrieveConversations.mockDeferredValueOnce(deferredValueRetrieveConversations)
    messagesGateway.retrieveConversationMessages.mockDeferredValueOnce(deferredValueRetrieveConversationMessages)

    const resolveAllDeferredValue = () => {
      messagesGateway.retrieveConversations.resolveDeferredValue()
      messagesGateway.retrieveConversationMessages.resolveDeferredValue()
    }

    const store = configureStoreWithMessages(
      {
        dependencies: {
          messagesGateway,
        },
        initialAppState: {
          messages: {
            ...fakeMessagesData,
            conversations: {},
            conversationsUuids: [],
            selectedConversationUuid: null,
            isIdle: true,
          },
        },
      },
    )

    const selectedConversationId = conversationsFromGateway[0].uuid

    // --------------------------------------------------

    store.dispatch(publicActions.setCurrentConversationUuid(selectedConversationId))

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(messagesGateway.retrieveConversationMessages).toHaveBeenCalledWith({ entourageUuid: selectedConversationId })
    expect(messagesGateway.retrieveConversations).toHaveBeenCalledWith({ page: 0 })
  })

  it(`
    Given messages have not been retrieved from gateway
      And has no selected conversation uuid
    When conversation uuid is set to null
    Then messages should be retrieved from gateway
  `, async () => {
    const conversationsFromGateway = createConversationList()

    const deferredValueRetrieveConversations = {
      conversations: conversationsFromGateway,
    }

    const messagesGateway = new TestMessagesGateway()
    messagesGateway.retrieveConversations.mockDeferredValueOnce(deferredValueRetrieveConversations)

    const resolveAllDeferredValue = () => {
      messagesGateway.retrieveConversations.resolveDeferredValue()
    }

    const store = configureStoreWithMessages(
      {
        dependencies: {
          messagesGateway,
        },
        initialAppState: {
          messages: {
            ...fakeMessagesData,
            conversations: {},
            conversationsUuids: [],
            selectedConversationUuid: null,
            isIdle: true,
          },
        },
      },
    )

    const selectedConversationId = null

    // --------------------------------------------------

    store.dispatch(publicActions.setCurrentConversationUuid(selectedConversationId))

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(messagesGateway.retrieveConversations).toHaveBeenCalledWith({
      page: 0,
    })
  })

  it(`
    Given messages have been retrieved from gateway
    When there is a multiple of 25 message in the list
    Then user should be able to fetch more
  `, async () => {
    const messagesGateway = new TestMessagesGateway()

    const store = configureStoreWithMessages({
      dependencies: { messagesGateway },
      initialAppState: {
        messages: {
          ...fakeMessagesData,
          conversations: {
            abc: createConversationItem(),
          },
          conversationsMessages: {
            abc: Array(50).fill(createConversationMessages()[0]),
          },
          isIdle: false,
        },
      },
    })

    await store.waitForActionEnd()

    expect(selectCanFetchMoreMessages(store.getState())).toBeTruthy()
  })

  it(`
    Given messages have been retrieved from gateway
    When there is not a multiple of 25 messages in the list
    Then user should not be able to fetch more
  `, async () => {
    const messagesGateway = new TestMessagesGateway()

    const store = configureStoreWithMessages({
      dependencies: { messagesGateway },
      initialAppState: {
        messages: {
          ...fakeMessagesData,
          conversations: {
            abc: createConversationItem(),
          },
          conversationsMessages: {
            abc: Array(34).fill(createConversationMessages()[0]),
          },
          isIdle: false,
        },
      },
    })

    await store.waitForActionEnd()

    expect(selectCanFetchMoreMessages(store.getState())).toBeFalsy()
  })

  it(`
    Given messages have been retrieved from gateway
    When there a multiple of 25 messages in the list
      And user asks to fetch more
    Then older messages should be fetched from gateway
      And older messages should be added to existing messages
  `, async () => {
    const messagesGateway = new TestMessagesGateway()

    const messagesFromStore = Array(25).fill(createConversationMessages()[0])

    const store = configureStoreWithMessages({
      dependencies: { messagesGateway },
      initialAppState: {
        messages: {
          ...fakeMessagesData,
          conversations: {
            abc: createConversationItem(),
          },
          conversationsMessages: {
            abc: messagesFromStore,
          },
          isIdle: false,
        },
      },
    })

    await store.waitForActionEnd()

    expect(selectCanFetchMoreMessages(store.getState())).toBeFalsy()

    const conversationMessagesFromGateway = [
      ...createConversationMessages(),
    ]

    const deferredValueRetrieveConversations = {
      conversationMessages: [
        ...Array(25).fill(conversationMessagesFromGateway[0]),
      ],
    }

    const selectedConversationId = 'abc'

    messagesGateway.retrieveConversationMessages.mockDeferredValueOnce(deferredValueRetrieveConversations)
    messagesGateway.retrieveConversationMessages.resolveDeferredValue()

    store.dispatch(publicActions.setCurrentConversationUuid(selectedConversationId))
    expect(selectConversationMessagesIsFetching(store.getState())).toEqual(true)

    await store.waitForActionEnd()

    expect(messagesGateway.retrieveConversationMessages).toHaveBeenCalledWith({ entourageUuid: selectedConversationId })

    expect(selectConversationMessagesIsFetching(store.getState())).toEqual(false)

    expect(selectCurrentConversationMessages(store.getState())).toStrictEqual([
      ...messagesFromStore,
      ...deferredValueRetrieveConversations.conversationMessages,
    ])
  })
})

