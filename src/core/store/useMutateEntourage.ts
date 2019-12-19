import { useMutation } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from './queryKeys'

type Data = typeof schema['/entourages POST']['data']['entourage']

export function useMutateEntourages() {
  return useMutation((data: Data) => {
    return api.request({
      name: '/entourages POST',
      data: {
        entourage: data,
      },
    })
  }, {
    refetchQueries: [queryKeys.entourageUsers],
  })
}
