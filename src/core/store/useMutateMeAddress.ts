import { useMutation } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from './queryKeys'

type Data = typeof schema['/users/me/address POST']['data']['address']

export function useMutateMeAddress(refetchQueryMe = true) {
  return useMutation((data: Data) => {
    return api.request({
      name: '/users/me/address POST',
      data: {
        address: data,
      },
    })
  }, {
    refetchQueries: refetchQueryMe ? [queryKeys.me] : [],
  })
}
