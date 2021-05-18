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

export function selectMessagesIsFetching(state: AppState) {
  return state.messages.fetching
}

export function selectConversationList(state: AppState) {
  // TODO Use reselect
  return state.messages.conversationsUuids.map((conversationUuid) => {
    return state.messages.conversations[conversationUuid]
  })
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

export function selectCurrentConversation(state: AppState) {
  const { selectedConversationUuid, conversations } = state.messages
  return selectedConversationUuid ? conversations[selectedConversationUuid] : null
}

export function selectCurrentConversationMessages(state: AppState) {
  const { selectedConversationUuid, conversationsMessages } = state.messages
  return selectedConversationUuid ? conversationsMessages[selectedConversationUuid] : null
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
