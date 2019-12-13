import { useQuery } from 'react-query'
import { api } from 'src/network/api'
import { queryKeys } from './queryKeys'

export function useQueryEntourageChatMessages(entourageId: number | null) {
  return useQuery(!entourageId ? null : [queryKeys.chatMessage(entourageId), { entourageId }], () => {
    if (!entourageId) {
      throw new Error('entourageId can\'t be null')
    }

    return api.request({
      name: 'GET /entourages/:entourageId/chat_messages',
      pathParams: {
        entourageId,
      },
    })
  })
}
