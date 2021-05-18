import { ConversationItem, ConversationMessage, MessagesState } from './messages.reducer'

export interface IMessagesGateway {
  retrieveConversations(data: { page: MessagesState['page']; }): Promise<{
    conversations: ConversationItem[];
  }>;

  retrieveConversationMessages(data: {
    entourageUuid: ConversationItem['uuid'];
    before?: string;
  }): Promise<{
    conversationMessages: ConversationMessage[];
  }>;

  sendMessage(data: {
    entourageUuid: ConversationItem['uuid'];
    message: string;
  }): Promise<void | null>;
}
