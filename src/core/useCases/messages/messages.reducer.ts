import uniqBy from 'lodash/uniqBy'
import { AuthUserAction, AuthUserActionType } from '../authUser/authUser.actions'
import { MyFeedGroupType, FeedJoinStatus, User } from 'src/core/api'
import { DateISO } from 'src/utils/types'
import { MessagesAction, MessagesActionType } from './messages.actions'

export interface ConversationItem {
  author: {
    avatarUrl: string | null;
    id: number;
  };
  joinStatus: FeedJoinStatus;
  lastMessage: {
    text: string;
  } | null;
  title: string;
  uuid: string;
  groupType: MyFeedGroupType;
  updatedAt: DateISO;
  numberOfUnreadMessages: number;
}

export interface ConversationMessage {
  content: string;
  createdAt: DateISO;
  id: number;
  user: {
    avatarUrl: User['avatarUrl'];
    displayName: NonNullable<User['displayName']>;
    id: NonNullable<User['id']>;
    partner: User['partner'];
  };
}

export interface MessagesState {
  isIdle: boolean;
  fetching: boolean;
  conversationsUuids: string[];
  conversations: {
    [conversationUuid: string]: ConversationItem;
  };
  conversationsMessages: {
    [conversationUuid: string]: ConversationMessage[];
  };
  unreadConversations: number;
  selectedConversationUuid: string | null;
  page: number;
  messagesFetching: boolean;
}

export const defaultMessagesState: MessagesState = {
  isIdle: true,
  fetching: false,
  conversationsUuids: [],
  conversations: {},
  unreadConversations: 0,
  selectedConversationUuid: null,
  page: 1,
  conversationsMessages: {},
  messagesFetching: false,
}

export function messagesReducer(
  state: MessagesState = defaultMessagesState,
  action: MessagesAction | AuthUserAction,
): MessagesState {
  switch (action.type) {
    case MessagesActionType.RETRIEVE_CONVERSATIONS: {
      return {
        ...state,
        page: 1,
      }
    }

    case MessagesActionType.RETRIEVE_CONVERSATIONS_STARTED: {
      return {
        ...state,
        fetching: true,
      }
    }

    case MessagesActionType.RETRIEVE_CONVERSATIONS_SUCCEEDED: {
      const newConversations = action.payload.conversations.filter(
        (conversation) => !state.conversationsUuids.includes(conversation.uuid),
      )
      const updatedConversations = action.payload.conversations.reduce(
        (acc: MessagesState['conversations'], item: MessagesState['conversations'][number]) => {
          return {
            ...acc,
            [item.uuid]: item,
          }
        }, state.conversations,
      )

      const updatedConversationUuids = [
        ...state.conversationsUuids,
        ...newConversations.map((item: ConversationItem) => item.uuid),
      ]

      updatedConversationUuids.sort((a, b) => {
        const dateA = new Date(updatedConversations[a].updatedAt)
        const dateB = new Date(updatedConversations[b].updatedAt)
        return dateB.getTime() - dateA.getTime()
      })

      return {
        ...state,
        isIdle: false,
        conversations: updatedConversations,
        conversationsUuids: updatedConversationUuids,
        fetching: false,
        unreadConversations: action.payload.unreadConversations ?? state.unreadConversations,
      }
    }

    case MessagesActionType.RETRIEVE_CONVERSATIONS_FAILED: {
      return {
        ...state,
        fetching: false,
      }
    }

    case MessagesActionType.RETRIEVE_NEXT_CONVERSATIONS: {
      return {
        ...state,
        page: state.fetching ? state.page : state.page + 1,
      }
    }

    case MessagesActionType.DECREMENT_PAGE_NUMBER: {
      return {
        ...state,
        page: state.page > 0 ? state.page - 1 : 0,
      }
    }

    case MessagesActionType.SET_CURRENT_CONVERSATION_UUID: {
      if (action.payload && state.conversations[action.payload]) {
        return {
          ...state,
          selectedConversationUuid: action.payload,
          conversations: {
            ...state.conversations,
            [action.payload]: state.conversations[action.payload],
          },
        }
      }

      return {
        ...state,
        selectedConversationUuid: action.payload,
      }
    }

    case MessagesActionType.RETRIEVE_CONVERSATION_MESSAGES_STARTED: {
      return {
        ...state,
        messagesFetching: true,
      }
    }

    case MessagesActionType.RETRIEVE_CONVERSATION_MESSAGES_SUCCEEDED: {
      const uniqMessages = uniqBy(
        [
          ...state.conversationsMessages[action.payload.conversationUuid] || [],
          ...action.payload.conversationMessages,
        ], (message) => message.id,
      )
      uniqMessages.sort((a, b) => b.id - a.id)

      const conversationDetails = state.conversations[action.payload.conversationUuid]

      const mutatedConversations = conversationDetails ? {
        ...state.conversations,
        [action.payload.conversationUuid]: {
          ...state.conversations[action.payload.conversationUuid],
          numberOfUnreadMessages: 0,
        },
      } : state.conversations

      const shouldDecrementUnreadConversationsCount = conversationDetails
        && conversationDetails.numberOfUnreadMessages > 0
        && state.unreadConversations > 0

      return {
        ...state,
        unreadConversations:
          shouldDecrementUnreadConversationsCount
            ? state.unreadConversations - 1
            : state.unreadConversations,
        conversationsMessages: {
          ...state.conversationsMessages,
          [action.payload.conversationUuid]: uniqMessages,
        },
        conversations: mutatedConversations,
        messagesFetching: false,
      }
    }

    case MessagesActionType.RETRIEVE_CONVERSATION_MESSAGES_FAILED: {
      return {
        ...state,
        messagesFetching: false,
      }
    }

    case MessagesActionType.SEND_MESSAGE: {
      if (state.selectedConversationUuid) {
        const otherConversationsUuids = state.conversationsUuids.filter(
          (conversationUuid) => conversationUuid !== state.selectedConversationUuid,
        )
        return {
          ...state,
          conversations: {
            ...state.conversations,
            [state.selectedConversationUuid]: {
              ...state.conversations[state.selectedConversationUuid],
              lastMessage: {
                text: action.payload.message,
              },
              updatedAt: new Date().toISOString(),
            },
          },
          conversationsUuids: [
            state.selectedConversationUuid,
            ...otherConversationsUuids,
          ],
        }
      }

      return { ...state }
    }

    case MessagesActionType.INSERT_CONVERSATION: {
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.payload.uuid]: {
            ...action.payload,
            numberOfUnreadMessages: 0,
          },
        },
      }
    }

    case AuthUserActionType.SET_USER: {
      if (!action.payload) {
        return defaultMessagesState
      }

      return {
        ...state,
      }
    }

    default:
      return state
  }
}
