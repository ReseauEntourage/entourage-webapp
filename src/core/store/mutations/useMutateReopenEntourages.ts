import { useMutation } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'

type Data = { id: number; }

export function useMutateReopenEntourages() {
  return useMutation((data: Data) => {
    const { id } = data
    return api.request({
      name: '/entourages PATCH',
      data: {
        entourage: {
          status: 'open',
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
