import { useMutation } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from './queryKeys'

interface Data {
  content: string;
}

export function useMutateCreateEntourageChatMessage(entourageId: number) {
  return useMutation((data: Data) => {
    return api.request({
      name: '/entourages/:entourageId/chat_messages POST',
      pathParams: {
        entourageId,
      },
      data: {
        chatMessage: {
          content: data.content,
        },
      },
    })
  }, {
    refetchQueries: [queryKeys.chatMessage(entourageId)],
  })
}
