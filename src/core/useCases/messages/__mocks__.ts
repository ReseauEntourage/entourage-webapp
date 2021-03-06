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
    groupType: 'action',
    updatedAt: new Date().toISOString(),
    numberOfUnreadMessages: 0,
  }
}

export function createConversationList(): ConversationItem[] {
  return new Array(10).fill(null).map(() => createConversationItem()).sort((a, b) => {
    const dateA = new Date(a.updatedAt)
    const dateB = new Date(b.updatedAt)
    return dateB.getTime() - dateA.getTime()
  })
}

export const fakeMessagesData: MessagesState = {
  ...defaultMessagesState,
  fetching: false,
  conversationsUuids: ['abc', 'def'],
  conversations: {
    abc: {
      ...createConversationItem(),
      uuid: 'abc',
    },
    def: {
      ...createConversationItem(),
      uuid: 'def',
    },
  },
  selectedConversationUuid: null,
}

export function createConversationMessages(): ConversationMessage[] {
  return [
    {
      content: 'Bonjour',
      createdAt: '2000-04-22T06:00:00Z',
      id: uniqIntId(),
      user: {
        avatarUrl: 'https://avatar.com',
        id: 2,
        displayName: 'Jean D.',
        partner: null,
      },
    },
    {
      content: 'Aurevoir',
      createdAt: '1999-05-22T06:00:00Z',
      id: uniqIntId(),
      user: {
        avatarUrl: 'https://avatar.com',
        id: 2,
        displayName: 'Jean D.',
        partner: null,
      },
    },
  ].sort((a, b) => b.id - a.id)
}
