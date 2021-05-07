import { uniqStringId } from 'src/utils/misc'
import { ConversationItem, defaultMessagesState, MessagesState } from './messages.reducer'

export function createPOI(): ConversationItem {
  return {
    uuid: uniqStringId(),
    author: {
      avatarUrl: '',
      id: 4,
    },
    joinStatus: 'accepted',
    lastMessage: {
      text: 'test',
    },
    title: 'Test titre',
  }
}

export function createConversationList(): ConversationItem[] {
  return new Array(10).fill(null).map(() => createPOI())
}

export const fakeMessagesData: MessagesState = {
  ...defaultMessagesState,
  fetching: false,
  conversationsUuids: ['abc', 'def'],
  conversations: {
    abc: createPOI(),
    def: createPOI(),
  },
  selectedConversationUuid: null,
}

export function createConversationItem(): ConversationItem {
  return {
    uuid: uniqStringId(),
    author: {
      avatarUrl: 'https://avatar.com',
      id: 2,
    },
    joinStatus: 'accepted',
    lastMessage: {
      text: 'test',
    },
    title: 'Test conversation titre',
  }
}
