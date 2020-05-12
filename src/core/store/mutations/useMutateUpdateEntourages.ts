import { useMutation } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from 'src/core/store'

type DataBody = typeof schema['/entourages PATCH']['data']['entourage']

type Data = DataBody & { id: number; }

export function useMutateUpdateEntourages() {
  return useMutation((data: Data) => {
    const { id, ...restData } = data
    return api.request({
      name: '/entourages PATCH',
      data: {
        entourage: restData,
      },
      pathParams: {
        entourageId: id,
      },
    })
  }, {
    refetchQueries: [queryKeys.feeds],
  })
}
