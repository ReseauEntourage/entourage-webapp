import {
  ActionFromMapObject,
  ActionsFromMapObject,
} from 'src/utils/types'

import { MessagesState } from './messages.reducer'

export const MessagesActionType = {
  RETRIEVE_CONVERSATIONS: 'MESSAGES/RETRIEVE_CONVERSATIONS',
  RETRIEVE_NEXT_CONVERSATIONS: 'MESSAGES/RETRIEVE_NEXT_CONVERSATIONS',
  RETRIEVE_CONVERSATIONS_STARTED: 'MESSAGES/RETRIEVE_CONVERSATIONS_STARTED',
  RETRIEVE_CONVERSATIONS_SUCCEEDED: 'MESSAGES/RETRIEVE_CONVERSATIONS_SUCCEEDED',
  RETRIEVE_CONVERSATION_MESSAGES_STARTED: 'MESSAGES/RETRIEVE_CONVERSATION_MESSAGES_STARTED',
  RETRIEVE_CONVERSATION_MESSAGES_SUCCEEDED: 'MESSAGES/RETRIEVE_CONVERSATION_MESSAGES_SUCCEEDED',
  SET_CURRENT_CONVERSATION_UUID: 'MESSAGES/SET_CURRENT_CONVERSATION_UUID',
  DECREMENT_PAGE_NUMBER: 'MESSAGES/DECREMENT_PAGE_NUMBER',
} as const

export type MessagesActionType = keyof typeof MessagesActionType;

// ------------------------------------------------------------------------

function retrieveConversations() {
  return {
    type: MessagesActionType.RETRIEVE_CONVERSATIONS,
  }
}

function retrieveNextConversations() {
  return {
    type: MessagesActionType.RETRIEVE_NEXT_CONVERSATIONS,
  }
}

function decrementPageNumber() {
  return {
    type: MessagesActionType.DECREMENT_PAGE_NUMBER,
  }
}

function retrieveConversationsStarted() {
  return {
    type: MessagesActionType.RETRIEVE_CONVERSATIONS_STARTED,
  }
}

function retrieveConversationsSuccess(
  payload: {
    conversations: MessagesState['conversations'][string][];
  },
) {
  return {
    type: MessagesActionType.RETRIEVE_CONVERSATIONS_SUCCEEDED,
    payload,
  }
}

function retrieveConversationMessagesStarted() {
  return {
    type: MessagesActionType.RETRIEVE_CONVERSATION_MESSAGES_STARTED,
  }
}

function retrieveConversationMessagesSuccess(
  payload: {
    conversationMessages: MessagesState['conversationsMessages'][string];
  },
) {
  return {
    type: MessagesActionType.RETRIEVE_CONVERSATION_MESSAGES_SUCCEEDED,
    payload,
  }
}

function setCurrentConversationUuid(payload: string | null) {
  return {
    type: MessagesActionType.SET_CURRENT_CONVERSATION_UUID,
    payload,
  }
}
// --------------------------------------------------------------------------------

export const publicActions = {
  retrieveConversations,
  retrieveNextConversations,
  setCurrentConversationUuid,
}

const privateActions = {
  retrieveConversationsStarted,
  retrieveConversationsSuccess,
  decrementPageNumber,
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type MessagesActions = ActionsFromMapObject<typeof actions>
export type MessagesAction = ActionFromMapObject<typeof actions>
