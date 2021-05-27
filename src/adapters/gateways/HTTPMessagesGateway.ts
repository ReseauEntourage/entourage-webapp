import { api } from 'src/core/api'
import { IMessagesGateway } from 'src/core/useCases/messages'

export class HTTPMessagesGateway implements IMessagesGateway {
  retrieveConversations: IMessagesGateway['retrieveConversations'] = ({ page }) => {
    return api.request({
      name: '/myfeeds GET',
      params: {
        page,
      },
    }).then((res) => {
      const { feeds } = res.data
      const items = feeds.map((conversation) => {
        return {
          author: conversation.data.author,
          joinStatus: conversation.data.joinStatus,
          lastMessage: conversation.data.lastMessage,
          title: conversation.data.title,
          uuid: conversation.data.uuid,
          id: conversation.data.id,
          groupType: conversation.data.groupType,
        }
      })

      return {
        conversations: items,
      }
    })
  }

  retrieveConversationMessages: IMessagesGateway['retrieveConversationMessages'] = ({ entourageUuid, before }) => {
    return api.request({
      name: '/entourages/:entourageId/chat_messages GET',
      pathParams: {
        entourageUuid,
      },
      params: {
        before,
      },
    }).then((res) => {
      const { chatMessages } = res.data
      const items = chatMessages.map((chatMessage) => {
        return {
          content: chatMessage.content,
          createdAt: chatMessage.createdAt,
          id: chatMessage.id,
          messageType: chatMessage.messageType,
          user: chatMessage.user,
        }
      })

      return {
        conversationMessages: items,
      }
    })
  }

  retrieveConversation(data: { entourageUuid: string; }) {
    return api.request({
      name: '/entourages/:entourageId GET',
      pathParams: {
        entourageUuid: data.entourageUuid,
      },
    }).then((res) => {
      const { entourage } = res.data
      return {
        author: entourage.author,
        joinStatus: entourage.joinStatus,
        title: entourage.title,
        uuid: entourage.uuid,
        id: entourage.id,
        groupType: entourage.groupType,
      }
    })
  }

  sendMessage: IMessagesGateway['sendMessage'] = ({ entourageUuid, message }) => {
    return api.request({
      name: '/entourages/:entourageId/chat_messages POST',
      pathParams: {
        entourageUuid,
      },
      data: {
        chatMessage: {
          content: message,
        },
      },
    }).then(() => {
      return null
    })
  }
}
