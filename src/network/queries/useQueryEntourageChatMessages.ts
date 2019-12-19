import { useQuery } from 'react-query'
import { api } from 'src/network/api'
import { assertIsDefined } from 'src/utils/misc'
import { queryKeys } from './queryKeys'

export function useQueryEntourageChatMessages(entourageId: number | null) {
  return useQuery(!entourageId ? null : [queryKeys.chatMessage(entourageId), { entourageId }], () => {
    assertIsDefined(entourageId, 'useQueryEntourageChatMessages required entourageId')

    return api.request({
      name: 'GET /entourages/:entourageId/chat_messages',
      pathParams: {
        entourageId,
      },
    })
  })
}
