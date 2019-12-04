import { useMutation } from 'react-query'
import { api, schema } from 'src/network/api'
import { queryKeys } from './queryKeys'

type Data = typeof schema['POST /users/me/address']['data']['address']

export function useMutateMeAddress(refetchQueryMe = true) {
  return useMutation((data: Data) => {
    return api.request({
      routeName: 'POST /users/me/address',
      data: {
        address: data,
      },
    })
  }, {
    refetchQueries: refetchQueryMe ? [queryKeys.me] : [],
  })
}
