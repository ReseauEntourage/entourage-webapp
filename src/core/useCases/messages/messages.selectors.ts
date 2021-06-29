import { createSelector } from 'reselect'
import { MessagesState } from './messages.reducer'

interface AppState {
  messages: MessagesState;
}

export function selectMessagesIsIdle(state: AppState) {
  return state.messages.isIdle
}

export function selectMessages(state: AppState) {
  return state.messages
}

export function selectConversationsIsFetching(state: AppState) {
  return state.messages.fetching
}

export const selectConversationList = createSelector(
  (state: AppState) => state.messages.conversationsUuids,
  (state: AppState) => state.messages.conversations,
  (conversationsUuids, conversations) => conversationsUuids.map((conversationUuid) => {
    return conversations[conversationUuid]
  }),
)

export function selectNumberOfUnreadConversations(state: AppState) {
  return state.messages.unreadConversations
}

export function selectMessagesCurrentPage(state: AppState) {
  return state.messages.page
}

export function selectCurrentConversationUuid(state: AppState) {
  return state.messages.selectedConversationUuid
}

export function selectConversationMessagesIsFetching(state: AppState) {
  return state.messages.messagesFetching
}

export function selectConversationIsInList(state: AppState) {
  return state.messages.conversationsUuids.includes(selectCurrentConversationUuid(state))
}

export function selectCurrentConversation(state: AppState) {
  const { selectedConversationUuid, conversations } = state.messages
  return selectedConversationUuid ? conversations[selectedConversationUuid] ?? null : null
}

export function selectCurrentConversationMessages(state: AppState) {
  const { selectedConversationUuid, conversationsMessages } = state.messages
  return selectedConversationUuid ? conversationsMessages[selectedConversationUuid] ?? null : null
}

export function selectLastMessageDateFromConversation(state: AppState) {
  const messages = selectCurrentConversationMessages(state)
  if (!messages || messages.length === 0) {
    return null
  }
  const lastMessage = messages[messages.length - 1]
  return lastMessage.createdAt
}

export function selectCanFetchMoreMessages(state: AppState) {
  const messages = selectCurrentConversationMessages(state)
  if (!messages || messages.length === 0) {
    return false
  }

  return messages.length % 25 === 0
}
