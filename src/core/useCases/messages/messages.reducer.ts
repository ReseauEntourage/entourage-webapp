import { FeedJoinStatus } from 'src/core/api'
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
}

export interface MessagesState {
  isIdle: boolean;
  fetching: boolean;
  conversationsUuids: string[];
  conversations: {
    [itemUuid: string]: ConversationItem;
  };
  selectedConversationUuid: string | null;
  page: number;
}

export const defaultMessagesState: MessagesState = {
  isIdle: true,
  fetching: false,
  conversationsUuids: [],
  conversations: {},
  selectedConversationUuid: null,
  page: 0,
}

export function messagesReducer(state: MessagesState = defaultMessagesState, action: MessagesAction): MessagesState {
  switch (action.type) {
    case MessagesActionType.RETRIEVE_CONVERSATIONS_STARTED: {
      return {
        ...state,
        fetching: true,
      }
    }

    case MessagesActionType.RETRIEVE_CONVERSATIONS_SUCCEEDED: {
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
        conversationsUuids: action.payload.conversations.map((item: ConversationItem) => item.uuid),
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

    default:
      return state
  }
}
