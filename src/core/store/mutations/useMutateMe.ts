import { useMutation } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from 'src/core/store'

type Data = typeof schema['/users/me PATCH']['data']['user']

export function useMutateMe() {
  return useMutation((data: Data) => {
    return api.request({
      name: '/users/me PATCH',
      data: {
        user: data,
      },
    })
  }, {
    refetchQueries: [queryKeys.me],
  })
}
