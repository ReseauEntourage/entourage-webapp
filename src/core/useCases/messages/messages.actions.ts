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
  RETRIEVE_CONVERSATION_DETAILS_STARTED: 'MESSAGES/RETRIEVE_CONVERSATION_DETAILS_STARTED',
  RETRIEVE_CONVERSATION_DETAILS_SUCCEEDED: 'MESSAGES/RETRIEVE_CONVERSATION_DETAILS_SUCCEEDED',
  SET_CURRENT_CONVERSATION_UUID: 'MESSAGES/SET_CURRENT_CONVERSATION_UUID',
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
/*

function retrievePOIDetailsStarted() {
  return {
    type: MessagesActionType.RETRIEVE_CONVERSATION_DETAILS_STARTED,
  }
}

function retrievePOIDetailsSuccess(
  payload: {
    poiDetails: MessagesState['detailedConversations'][string];
  },
) {
  return {
    type: MessagesActionType.RETRIEVE_POI_DETAILS_SUCCEEDED,
    payload,
  }
}
*/

function setCurrentPOIUuid(payload: string | null) {
  return {
    type: MessagesActionType.SET_CURRENT_CONVERSATION_UUID,
    payload,
  }
}
// --------------------------------------------------------------------------------

export const publicActions = {
  retrieveConversations,
  retrieveNextConversations,
  setCurrentPOIUuid,
}

const privateActions = {
  retrieveConversationsStarted,
  retrieveConversationsSuccess,
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type MessagesActions = ActionsFromMapObject<typeof actions>
export type MessagesAction = ActionFromMapObject<typeof actions>
