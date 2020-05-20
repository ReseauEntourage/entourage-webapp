import { useMutation } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'

interface Data {
  content: string;
}

export function useMutateCreateEntourageChatMessage(entourageUuid: string, refetchQueries?: string[]) {
  return useMutation((data: Data) => {
    return api.request({
      name: '/entourages/:entourageId/chat_messages POST',
      pathParams: {
        entourageUuid,
      },
      data: {
        chatMessage: {
          content: data.content,
        },
      },
    })
  }, {
    refetchQueries: [
      queryKeys.chatMessage(entourageUuid),
      ...(refetchQueries ?? []),
    ],
  })
}
