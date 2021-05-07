import { ConversationItem, MessagesState } from './messages.reducer'

export interface IMessagesGateway {
  retrieveConversations(data: { page: MessagesState['page']; }): Promise<{
    conversations: ConversationItem[];
  }>;
}
