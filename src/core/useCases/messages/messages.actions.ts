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
  RETRIEVE_CONVERSATION_MESSAGES: 'MESSAGES/RETRIEVE_CONVERSATION_MESSAGES',
  RETRIEVE_CONVERSATION_MESSAGES_STARTED: 'MESSAGES/RETRIEVE_CONVERSATION_MESSAGES_STARTED',
  RETRIEVE_CONVERSATION_MESSAGES_SUCCEEDED: 'MESSAGES/RETRIEVE_CONVERSATION_MESSAGES_SUCCEEDED',
  RETRIEVE_CONVERSATION_DETAILS_IF_NEEDED: 'MESSAGES/RETRIEVE_CONVERSATION_DETAILS_IF_NEEDED',
  RETRIEVE_OLDER_CONVERSATION_MESSAGES: 'MESSAGES/RETRIEVE_OLDER_CONVERSATION_MESSAGES',
  INSERT_CONVERSATION: 'MESSAGES/INSERT_CONVERSATION',
  SET_CURRENT_CONVERSATION_UUID: 'MESSAGES/SET_CURRENT_CONVERSATION_UUID',
  DECREMENT_PAGE_NUMBER: 'MESSAGES/DECREMENT_PAGE_NUMBER',
  SEND_MESSAGE: 'MESSAGES/SEND_MESSAGE',
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

function retrieveConversationMessages() {
  return {
    type: MessagesActionType.RETRIEVE_CONVERSATION_MESSAGES,
  }
}

function retrieveConversationMessagesStarted() {
  return {
    type: MessagesActionType.RETRIEVE_CONVERSATION_MESSAGES_STARTED,
  }
}

function retrieveConversationMessagesSuccess(
  payload: {
    conversationUuid: string;
    conversationMessages: MessagesState['conversationsMessages'][string];
  },
) {
  return {
    type: MessagesActionType.RETRIEVE_CONVERSATION_MESSAGES_SUCCEEDED,
    payload,
  }
}

function retrieveConversationDetailsIfNeeded() {
  return {
    type: MessagesActionType.RETRIEVE_CONVERSATION_DETAILS_IF_NEEDED,
  }
}

function insertConversation(payload: MessagesState['conversations'][string]) {
  return {
    type: MessagesActionType.INSERT_CONVERSATION,
    payload,
  }
}

function retrieveOlderConversationMessages(payload: { before: string | null; }) {
  return {
    type: MessagesActionType.RETRIEVE_OLDER_CONVERSATION_MESSAGES,
    payload,
  }
}

function setCurrentConversationUuid(payload: string | null) {
  return {
    type: MessagesActionType.SET_CURRENT_CONVERSATION_UUID,
    payload,
  }
}

function sendMessage(payload: {
  message: string;
}) {
  return {
    type: MessagesActionType.SEND_MESSAGE,
    payload,
  }
}
// --------------------------------------------------------------------------------

export const publicActions = {
  retrieveConversations,
  retrieveNextConversations,
  setCurrentConversationUuid,
  retrieveConversationMessages,
  retrieveOlderConversationMessages,
  sendMessage,
}

const privateActions = {
  retrieveConversationsStarted,
  retrieveConversationsSuccess,
  retrieveConversationMessagesStarted,
  retrieveConversationMessagesSuccess,
  decrementPageNumber,
  insertConversation,
  retrieveConversationDetailsIfNeeded,
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type MessagesActions = ActionsFromMapObject<typeof actions>
export type MessagesAction = ActionFromMapObject<typeof actions>
