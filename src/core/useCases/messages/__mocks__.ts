import { uniqIntId, uniqStringId } from 'src/utils/misc'
import { ConversationItem, ConversationMessage, defaultMessagesState, MessagesState } from './messages.reducer'

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
    id: uniqIntId(),
  }
}

export function createConversationList(): ConversationItem[] {
  return new Array(10).fill(null).map(() => createConversationItem())
}

export const fakeMessagesData: MessagesState = {
  ...defaultMessagesState,
  fetching: false,
  conversationsUuids: ['abc', 'def'],
  conversations: {
    abc: createConversationItem(),
    def: createConversationItem(),
  },
  selectedConversationUuid: null,
}

export function createConversationMessages(): ConversationMessage[] {
  return [
    {
      content: 'Bonjour',
      createdAt: '1977-04-22T06:00:00Z',
      id: 123,
      messageType: 'text',
      user: {
        avatarUrl: 'https://avatar.com',
        id: 2,
        displayName: 'Jean D.',
        partner: null,
      },
    },
    {
      content: 'Aurevoir',
      createdAt: '1977-05-22T06:00:00Z',
      id: 456,
      messageType: 'text',
      user: {
        avatarUrl: 'https://avatar.com',
        id: 2,
        displayName: 'Jean D.',
        partner: null,
      },
    },
  ]
}
