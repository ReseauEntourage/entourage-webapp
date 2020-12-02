import { useMutation } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'

type Data = { id: number; success?: boolean; }

export function useMutateCloseEntourages() {
  return useMutation((data: Data) => {
    const { id, success = true } = data
    return api.request({
      name: '/entourages PATCH',
      data: {
        entourage: {
          status: 'closed',
          outcome: {
            success,
          },
        },
      },
      pathParams: {
        entourageId: id,
      },
    })
  }, {
    refetchQueries: [queryKeys.feeds],
  })
}
