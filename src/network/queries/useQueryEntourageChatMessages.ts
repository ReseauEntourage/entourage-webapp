import { useQuery } from 'react-query'
import { api } from 'src/network/api'
import { queryKeys } from './queryKeys'

export function useQueryEntourageChatMessages(entourageId: number) {
  return useQuery([queryKeys.chatMessage(entourageId), { entourageId }], () => {
    return api.request({
      name: 'GET /entourages/:entourageId/chat_messages',
      pathParams: {
        entourageId,
      },
    })
  })
}
