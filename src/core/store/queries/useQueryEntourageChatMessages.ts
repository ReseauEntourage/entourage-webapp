import { useQuery } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'
import { assertIsDefined } from 'src/utils/misc'

export function useQueryEntourageChatMessages(entourageId: number | null) {
  return useQuery(!entourageId ? null : [queryKeys.chatMessage(entourageId), { entourageId }], () => {
    assertIsDefined(entourageId, 'useQueryEntourageChatMessages required entourageId')

    return api.request({
      name: '/entourages/:entourageId/chat_messages GET',
      pathParams: {
        entourageId,
      },
    })
  })
}
