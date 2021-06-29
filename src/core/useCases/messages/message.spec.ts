import uniqBy from 'lodash/uniqBy'
import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { createUser } from '../authUser/__mocks__'
import { defaultAuthUserState } from '../authUser/authUser.reducer'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'
import { uniqIntId } from 'src/utils/misc'
import { TestMessagesGateway } from './TestMessagesGateway'
import {
  createConversationItem,
  createConversationList,
  createConversationMessages,
  fakeMessagesData,
} from './__mocks__'

import { publicActions } from './messages.actions'
import { ConversationMessage } from './messages.reducer'
import { messagesSaga } from './messages.saga'
import {
  selectConversationList,
  selectCurrentConversation,
  selectConversationMessagesIsFetching,
  selectCanFetchMoreMessages,
  selectCurrentConversationMessages,
  selectLastMessageDateFromConversation,
  selectNumberOfUnreadConversations,
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
  messagesGateway.retrieveConversations.mockDeferredValueOnce({
    conversations: conversationsFromGateway,
    unreadConversations: 5,
  })
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

describe('Conversation', () => {
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
      And selected conversation be defined with the conversation details
      And selected conversation messages be defined with these conversation messages
      And messages fetching state be false after server response
      And current conversation unread messages count should be set to 0
      And unread conversations count should be decremented
  `, async () => {
    const messagesGateway = new TestMessagesGateway()

    const store = configureStoreWithMessages({
      dependencies: { messagesGateway },
      initialAppState: {
        messages: {
          ...fakeMessagesData,
          unreadConversations: 3,
          conversations: {
            ...fakeMessagesData.conversations,
            abc: {
              ...fakeMessagesData.conversations.abc,
              numberOfUnreadMessages: 5,
            },
          },
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

    expect(store.getState().messages.conversations[selectedConversationId].numberOfUnreadMessages).toBe(5)

    store.dispatch(publicActions.setCurrentConversationUuid(selectedConversationId))
    expect(selectConversationMessagesIsFetching(store.getState())).toEqual(true)

    await store.waitForActionEnd()

    expect(messagesGateway.retrieveConversationMessages).toHaveBeenCalledWith({ entourageUuid: selectedConversationId })

    expect(selectCurrentConversation(store.getState())).toEqual({
      ...fakeMessagesData.conversations[selectedConversationId],
      numberOfUnreadMessages: 0,
    })
    expect(selectCurrentConversationMessages(store.getState())).toEqual(conversationMessagesFromGateway)

    expect(selectConversationMessagesIsFetching(store.getState())).toEqual(false)

    expect(selectNumberOfUnreadConversations(store.getState())).toEqual(2)
  })

  it(`
    Given messages have been retrieved from gateway
    When user selects a conversation where he is not accepted
    Then an error should be returned when conversation messages are retrieved from gateway
      And selected conversation messages should be empty
      And selected conversation be defined with the conversation details
  `, async () => {
    const messagesGateway = new TestMessagesGateway()

    const store = configureStoreWithMessages({
      dependencies: { messagesGateway },
      initialAppState: {
        messages: {
          ...fakeMessagesData,
          conversations: {
            ...fakeMessagesData.conversations,
            abc: {
              ...fakeMessagesData.conversations.abc,
              joinStatus: 'pending',
            },
          },
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
    messagesGateway.retrieveConversationMessages.rejectDeferredValue()

    store.dispatch(publicActions.setCurrentConversationUuid(selectedConversationId))

    await store.waitForActionEnd()

    expect(messagesGateway.retrieveConversationMessages).toHaveBeenCalledWith({ entourageUuid: selectedConversationId })

    expect(selectCurrentConversationMessages(store.getState())).toEqual(null)

    expect(selectCurrentConversation(store.getState())).toEqual({
      ...fakeMessagesData.conversations[selectedConversationId],
      joinStatus: 'pending',
    })
  })

  it(`
    Given messages have been retrieved from gateway
    When user start a new conversation by contacting a user
    Then conversation details should be retrieved from gateway
      And conversation messages should be retrieved from gateway
      And current conversation should be defined with the conversation details from the gateway
      And current conversation messages should be empty
      And selected conversation be defined with the conversation details
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

    const deferredValueRetrieveConversations = {
      conversationMessages: [],
    }

    const deferredValueConversationDetails = createConversationItem()

    const selectedConversationId = deferredValueConversationDetails.uuid

    messagesGateway.retrieveConversationMessages.mockDeferredValueOnce(deferredValueRetrieveConversations)
    messagesGateway.retrieveConversationMessages.resolveDeferredValue()

    messagesGateway.retrieveConversation.mockDeferredValueOnce(deferredValueConversationDetails)
    messagesGateway.retrieveConversation.resolveDeferredValue()

    store.dispatch(publicActions.setCurrentConversationUuid(selectedConversationId))
    expect(selectConversationMessagesIsFetching(store.getState())).toEqual(true)

    await store.waitForActionEnd()

    expect(selectCurrentConversation(store.getState())).toStrictEqual(deferredValueConversationDetails)
    expect(selectCurrentConversationMessages(store.getState())).toStrictEqual([])

    expect(selectConversationMessagesIsFetching(store.getState())).toEqual(false)
  })

  it(`
    Given messages have been retrieved from gateway
    When user selects a conversation that has already been selected before
    Then conversation should not be retrieved from gateway
      And selected conversation be defined with the conversation details
      And selected conversation messages be defined with these conversation messages
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

    expect(selectCurrentConversation(store.getState())).toEqual(fakeMessagesData.conversations.abc)
    expect(selectCurrentConversationMessages(store.getState())).toEqual(conversationMessagesFromGateway)
  })

  it(`
    Given messages have been retrieved from gateway
      And messages has selected conversation uuid
    When user fetch new messages
    Then conversation details should change
      And conversation messages should change
      And selected item should never change
  `, async () => {
    const { store, messagesGateway } = configureStoreWithSelectedMessages()

    const prevItems = selectConversationList(store.getState())
    const prevSelectedConversation = selectCurrentConversation(store.getState())
    const prevSelectedConversationMessages = selectCurrentConversationMessages(store.getState())

    store.dispatch(publicActions.retrieveConversations())

    messagesGateway.retrieveConversations.resolveDeferredValue()
    await store.waitForActionEnd()

    const nextItems = selectConversationList(store.getState())
    const nextSelectedConversation = selectCurrentConversation(store.getState())
    const nextSelectedConversationMessages = selectCurrentConversationMessages(store.getState())

    expect(nextItems).toBeTruthy()
    expect(prevItems).not.toEqual(nextItems)

    expect(nextSelectedConversation).toBeTruthy()
    expect(prevSelectedConversation).toEqual(nextSelectedConversation)

    expect(nextSelectedConversationMessages).toBeTruthy()
    expect(prevSelectedConversationMessages).toEqual(nextSelectedConversationMessages)
  })

  it(`
    Given messages have been retrieved from gateway
      And messages has selected conversation uuid
    When user selects a new current conversation uuid
    Then prev and next selected conversation details should be truthy
      And prev and next selected conversation messages should be truthy
      And prev and next selected conversation details should be different
      And prev and next selected conversation messages should be different
  `, async () => {
    const { store, messagesGateway, conversationsEntities } = configureStoreWithSelectedMessages()

    const prevSelectedConversation = selectCurrentConversation(store.getState())
    const prevSelectedConversationMessages = selectCurrentConversationMessages(store.getState())

    messagesGateway.retrieveConversationMessages.resolveDeferredValue()
    messagesGateway.retrieveConversations.resolveDeferredValue()

    store.dispatch(publicActions.setCurrentConversationUuid(Object.keys(conversationsEntities)[2]))

    await store.waitForActionEnd()
    const nextSelectedConversation = selectCurrentConversation(store.getState())
    const nextSelectedConversationMessages = selectCurrentConversationMessages(store.getState())

    expect(prevSelectedConversation).toBeTruthy()
    expect(nextSelectedConversation).toBeTruthy()

    expect(prevSelectedConversation).not.toEqual(nextSelectedConversation)

    expect(prevSelectedConversationMessages).toBeTruthy()
    expect(nextSelectedConversationMessages).toBeTruthy()

    expect(prevSelectedConversationMessages).not.toEqual(nextSelectedConversationMessages)
  })

  it(`
    Given messages have not been retrieved from gateway
    When user sets selected conversation uuid
      And selected conversation is part of the first page of conversation
    Then conversation messages should be retrieved from gateway
      And conversation list should be retrieved from gateway
      And conversation details should not have been retrieved from gateway
      And conversation messages should be updated with the values from gateway
      And conversation list should be updated with the values from gateway
      And current conversation should be defined with the conversation details from the list
      And current conversation unread messages count should be set to 0
  `, async () => {
    const conversationsFromGateway = createConversationList()
    const conversationMessagesFromGateway = createConversationMessages()

    const deferredValueRetrieveConversations = {
      conversations: conversationsFromGateway,
      unreadConversations: 3,
    }
    const deferredValueRetrieveConversationMessages = {
      conversationMessages: conversationMessagesFromGateway,
    }

    const deferredValueRetrieveConversationDetails = createConversationItem()

    const messagesGateway = new TestMessagesGateway()
    messagesGateway.retrieveConversations.mockDeferredValueOnce(deferredValueRetrieveConversations)
    messagesGateway.retrieveConversationMessages.mockDeferredValueOnce(deferredValueRetrieveConversationMessages)
    messagesGateway.retrieveConversation.mockDeferredValueOnce(deferredValueRetrieveConversationDetails)

    const resolveAllDeferredValue = () => {
      messagesGateway.retrieveConversations.resolveDeferredValue()
      messagesGateway.retrieveConversationMessages.resolveDeferredValue()
      messagesGateway.retrieveConversation.resolveDeferredValue()
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
    expect(messagesGateway.retrieveConversations).toHaveBeenCalledWith({ page: 1 })
    expect(messagesGateway.retrieveConversation).toHaveBeenCalledTimes(0)

    expect(selectCurrentConversation(store.getState())).toBeTruthy()
    expect(selectCurrentConversation(store.getState())).toStrictEqual({
      ...conversationsFromGateway[0],
      numberOfUnreadMessages: 0,
    })
    expect(selectCurrentConversationMessages(store.getState())).toStrictEqual(conversationMessagesFromGateway)
    expect(selectConversationList(store.getState())).toStrictEqual(conversationsFromGateway)
  })

  it(`
    Given messages have not been retrieved from gateway
    When user sets selected conversation uuid
      And selected conversation is not on the first page of the list
    Then conversation list should be retrieved from gateway
      And conversation details should be retrieved from gateway
      And conversation list should be updated with the values from gateway
      And current conversation should be defined with the conversation details from the gateway
      And current conversation unread messages count should be set to 0
  `, async () => {
    const conversationsFromGateway = createConversationList()
    const conversationMessagesFromGateway: ConversationMessage[] = []

    const deferredValueRetrieveConversations = {
      conversations: conversationsFromGateway,
      unreadConversations: 3,
    }
    const deferredValueRetrieveConversationMessages = {
      conversationMessages: conversationMessagesFromGateway,
    }

    const deferredValueRetrieveConversation = {
      ...createConversationItem(),
      numberOfUnreadMessages: 5,
    }

    const messagesGateway = new TestMessagesGateway()
    messagesGateway.retrieveConversations.mockDeferredValueOnce(deferredValueRetrieveConversations)
    messagesGateway.retrieveConversationMessages.mockDeferredValueOnce(deferredValueRetrieveConversationMessages)
    messagesGateway.retrieveConversation.mockDeferredValueOnce(deferredValueRetrieveConversation)

    const resolveAllDeferredValue = () => {
      messagesGateway.retrieveConversations.resolveDeferredValue()
      messagesGateway.retrieveConversationMessages.resolveDeferredValue()
      messagesGateway.retrieveConversation.resolveDeferredValue()
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

    const selectedConversationId = deferredValueRetrieveConversation.uuid

    // --------------------------------------------------

    store.dispatch(publicActions.setCurrentConversationUuid(selectedConversationId))

    resolveAllDeferredValue()

    await store.waitForActionEnd()

    expect(messagesGateway.retrieveConversations).toHaveBeenCalledWith({ page: 1 })
    expect(messagesGateway.retrieveConversation).toHaveBeenCalledWith({ entourageUuid: selectedConversationId })

    expect(selectCurrentConversation(store.getState())).toBeTruthy()
    expect(selectCurrentConversation(store.getState())).toStrictEqual({
      ...deferredValueRetrieveConversation,
      numberOfUnreadMessages: 0,
    })

    expect(selectConversationList(store.getState())).toStrictEqual(conversationsFromGateway)
  })

  it(`
    Given messages have not been retrieved from gateway
      And has no selected conversation uuid
    When conversation uuid is set to null
    Then conversations should be retrieved from gateway
  `, async () => {
    const conversationsFromGateway = createConversationList()

    const deferredValueRetrieveConversations = {
      conversations: conversationsFromGateway,
      unreadConversations: 3,
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
      page: 1,
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
          selectedConversationUuid: 'abc',
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
          selectedConversationUuid: 'abc',
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
    Then the oldest message date should really be the oldest message date
      And older messages should be fetched from gateway
      And gateway should have been called with the oldest message date
      And older messages should be added to existing messages
  `, async () => {
    const messagesGateway = new TestMessagesGateway()

    const messagesFromStore = []
    for (let i = 0; i < 25; i += 1) {
      messagesFromStore.push(createConversationMessages()[0])
    }

    const oldestDate = '1998-04-22T06:00:00Z'
    messagesFromStore[messagesFromStore.length - 1].createdAt = oldestDate

    const store = configureStoreWithMessages({
      dependencies: { messagesGateway },
      initialAppState: {
        messages: {
          ...fakeMessagesData,
          selectedConversationUuid: 'abc',
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

    expect(selectCanFetchMoreMessages(store.getState())).toBeTruthy()

    const messagesFromGateway = []
    for (let i = 0; i < 25; i += 1) {
      messagesFromGateway.push(createConversationMessages()[0])
    }

    const deferredValueRetrieveConversations = {
      conversationMessages: [
        ...messagesFromGateway,
      ],
    }

    const selectedConversationId = 'abc'

    messagesGateway.retrieveConversationMessages.mockDeferredValueOnce(deferredValueRetrieveConversations)
    messagesGateway.retrieveConversationMessages.resolveDeferredValue()

    const lastMessageDate = selectLastMessageDateFromConversation(store.getState())

    store.dispatch(publicActions.retrieveOlderConversationMessages({
      before: lastMessageDate,
    }))

    await store.waitForActionEnd()

    expect(lastMessageDate).toStrictEqual(oldestDate)

    expect(messagesGateway.retrieveConversationMessages).toHaveBeenCalledWith({
      entourageUuid: selectedConversationId, before: oldestDate,
    })

    const uniqMessages = uniqBy(
      [
        ...messagesFromStore,
        ...deferredValueRetrieveConversations.conversationMessages || [],
      ], (message) => message.id,
    )
    uniqMessages.sort((a, b) => b.id - a.id)

    expect(selectCurrentConversationMessages(store.getState())).toStrictEqual(uniqMessages)
  })

  it(`
    Given messages have been retrieved from gateway
      And user has selected a conversation
      And the conversation messages have been retrieved
    When user sends a new message
    Then the new message should be sent to gateway
      And the selected conversation messages list should be retrieved from gateway
      And the selected conversation messages list should contain the new message
      And the new message should be set as the last message of the conversation
  `, async () => {
    const messagesGateway = new TestMessagesGateway()

    const storeConversation = createConversationItem()

    const storeMessages = []
    for (let i = 0; i < 50; i += 1) {
      storeMessages.push(createConversationMessages()[0])
    }

    const loggedInUser = createUser()

    const store = configureStoreWithMessages({
      dependencies: { messagesGateway },
      initialAppState: {
        authUser: {
          ...defaultAuthUserState,
          user: loggedInUser,
        },
        messages: {
          ...fakeMessagesData,
          selectedConversationUuid: 'abc',
          conversations: {
            abc: storeConversation,
          },
          conversationsMessages: {
            abc: storeMessages,
          },
          isIdle: false,
        },
      },
    })

    const newMessageParams = { message: 'Bonsoir' }

    const newMessageEntity: ConversationMessage = {
      content: newMessageParams.message,
      createdAt: '2021-04-22T06:00:00Z',
      id: uniqIntId(),
      user: {
        avatarUrl: loggedInUser.avatarUrl,
        displayName: `${loggedInUser.firstName} ${loggedInUser.lastName[0]}`,
        id: loggedInUser.id,
        partner: null,
      },
    }

    messagesGateway.sendMessage.mockDeferredValueOnce()
    messagesGateway.retrieveConversationMessages.mockDeferredValueOnce({
      conversationMessages: [
        ...storeMessages,
        newMessageEntity,
      ],
    })

    messagesGateway.sendMessage.resolveDeferredValue()
    messagesGateway.retrieveConversationMessages.resolveDeferredValue()

    store.dispatch(publicActions.sendMessage(newMessageParams))

    await store.waitForActionEnd()

    expect(messagesGateway.sendMessage).toHaveBeenCalledWith({
      entourageUuid: 'abc', message: newMessageParams.message,
    })

    expect(messagesGateway.retrieveConversationMessages).toHaveBeenCalledWith({
      entourageUuid: 'abc',
    })

    const uniqMessages = uniqBy(
      [
        ...storeMessages,
        newMessageEntity,
      ], (message) => message.id,
    )
    uniqMessages.sort((a, b) => b.id - a.id)

    expect(selectCurrentConversationMessages(store.getState())).toStrictEqual(uniqMessages)

    expect(selectCurrentConversation(store.getState())).toStrictEqual({
      ...storeConversation,
      lastMessage: {
        text: newMessageParams.message,
      },
      updatedAt: selectCurrentConversation(store.getState())?.updatedAt,
    })
  })

  it(`
    Given user starts a new conversation
    When user sends a new message
    Then the new message should be sent to gateway
      And the new conversation messages list should be retrieved from gateway
      And the new conversation messages list should contain only the new message
      And the conversation list should be updated with the newly created conversation
  `, async () => {
    const messagesGateway = new TestMessagesGateway()

    const storeConversation = {
      ...createConversationItem(),
      uuid: 'abc',
    }

    const newConversation = {
      ...createConversationItem(),
      uuid: 'def',
    }

    const storeMessages = []
    for (let i = 0; i < 50; i += 1) {
      storeMessages.push(createConversationMessages()[0])
    }

    const loggedInUser = createUser()

    const store = configureStoreWithMessages({
      dependencies: { messagesGateway },
      initialAppState: {
        authUser: {
          ...defaultAuthUserState,
          user: loggedInUser,
        },
        messages: {
          ...fakeMessagesData,
          conversationsUuids: ['abc'],
          selectedConversationUuid: 'def',
          conversations: {
            abc: storeConversation,
            def: newConversation,
          },
          conversationsMessages: {
            abc: storeMessages,
            def: [],
          },
          isIdle: false,
        },
      },
    })

    const newMessageParams = { message: 'Bonsoir' }

    const newMessageEntity: ConversationMessage = {
      content: newMessageParams.message,
      createdAt: '2021-04-22T06:00:00Z',
      id: uniqIntId(),
      user: {
        avatarUrl: loggedInUser.avatarUrl,
        displayName: `${loggedInUser.firstName} ${loggedInUser.lastName[0]}`,
        id: loggedInUser.id,
        partner: null,
      },
    }

    const updatedConversation = {
      ...newConversation,
      lastMessage: {
        text: newMessageParams.message,
      },
      uuid: 'def',
    }

    const deferredValueRetrieveConversations = {
      conversations: [
        storeConversation,
        updatedConversation,
      ],
      unreadConversations: 5,
    }

    messagesGateway.sendMessage.mockDeferredValueOnce()
    messagesGateway.retrieveConversationMessages.mockDeferredValueOnce({
      conversationMessages: [
        newMessageEntity,
      ],
    })
    messagesGateway.retrieveConversations.mockDeferredValueOnce(deferredValueRetrieveConversations)

    store.dispatch(publicActions.sendMessage(newMessageParams))

    messagesGateway.sendMessage.resolveDeferredValue()
    messagesGateway.retrieveConversations.resolveDeferredValue()
    messagesGateway.retrieveConversationMessages.resolveDeferredValue()

    await store.waitForActionEnd()

    expect(messagesGateway.sendMessage).toHaveBeenCalledWith({
      entourageUuid: 'def',
      message: newMessageParams.message,
    })

    expect(selectCurrentConversationMessages(store.getState())).toStrictEqual([
      newMessageEntity,
    ])

    expect(selectCurrentConversation(store.getState())).toStrictEqual({
      ...updatedConversation,
      updatedAt: selectCurrentConversation(store.getState())?.updatedAt,
    })

    expect(selectConversationList(store.getState())).toStrictEqual([
      {
        ...updatedConversation,
        updatedAt: selectCurrentConversation(store.getState())?.updatedAt,
      },
      storeConversation,
    ])
  })
})

