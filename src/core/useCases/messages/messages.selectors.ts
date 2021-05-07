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

export function selectMessagesCurrentPage(state: AppState) {
  return state.messages.page
}

/*
export function selectConversationDetailsIsFetching(state: AppState) {
  return state.messages.detailsFetching
}
*/

export function selectConversationList(state: AppState) {
  return state.messages.conversationsUuids.map((conversationUuid) => {
    return state.messages.conversations[conversationUuid]
  })
}

export function selectCurrentConversationUuid(state: AppState) {
  return state.messages.selectedConversationUuid
}
