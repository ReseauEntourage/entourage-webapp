import { api } from 'src/core/api'
import { IMessagesGateway } from 'src/core/useCases/messages'

export class HTTPMessagesGateway implements IMessagesGateway {
  retrieveConversations: IMessagesGateway['retrieveConversations'] = (data) => {
    return api.request({
      name: '/myfeeds GET',
      params: {
        page: data.page,
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
        }
      })

      return {
        conversations: items,
      }
    })
  }
}
