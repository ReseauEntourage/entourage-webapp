import { AuthUserAction, AuthUserActionType } from '../authUser/authUser.actions'
import { FeedJoinStatus, User } from 'src/core/api'
import { DateISO } from 'src/utils/types'
import { MessagesAction, MessagesActionType } from './messages.actions'

export interface ConversationItem {
  author: {
    avatarUrl: string;
    id: number;
  };
  joinStatus: FeedJoinStatus;
  lastMessage?: {
    text: string;
  };
  title: string;
  uuid: string;
  id: number;
}

export interface ConversationMessage {
  content: string;
  createdAt: DateISO;
  id: number;
  messageType: 'text';
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
  selectedConversationUuid: string | null;
  page: number;
  messagesFetching: boolean;
}

export const defaultMessagesState: MessagesState = {
  isIdle: true,
  fetching: false,
  conversationsUuids: [],
  conversations: {},
  selectedConversationUuid: null,
  page: 0,
  conversationsMessages: {},
  messagesFetching: false,
}

export function messagesReducer(
  state: MessagesState = defaultMessagesState,
  action: MessagesAction | AuthUserAction,
): MessagesState {
  switch (action.type) {
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

      return {
        ...state,
        isIdle: false,
        conversations: action.payload.conversations.reduce(
          (acc: MessagesState['conversations'], item: MessagesState['conversations'][number]) => {
            return {
              ...acc,
              [item.uuid]: item,
            }
          }, state.conversations,
        ),

        conversationsUuids: [
          ...state.conversationsUuids,
          ...newConversations.map((item: ConversationItem) => item.uuid),
        ],
        fetching: false,
      }
    }

    case MessagesActionType.RETRIEVE_NEXT_CONVERSATIONS: {
      return {
        ...state,
        page: state.fetching ? state.page : state.page + 1,
      }
    }

    case MessagesActionType.SET_CURRENT_CONVERSATION_UUID: {
      return {
        ...state,
        selectedConversationUuid: action.payload,
      }
    }

    case MessagesActionType.DECREMENT_PAGE_NUMBER: {
      return {
        ...state,
        page: state.page > 0 ? state.page - 1 : 0,
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
