import { useMutation } from 'react-query'
import { api, schema } from 'src/network/api'
import { queryKeys } from './queryKeys'

type Data = typeof schema['PATCH /users/me']['data']['user']

export function useMutateMe() {
  return useMutation((data: Data) => {
    return api.request({
      name: 'PATCH /users/me',
      data: {
        user: data,
      },
    })
  }, {
    refetchQueries: [queryKeys.me],
  })
}
