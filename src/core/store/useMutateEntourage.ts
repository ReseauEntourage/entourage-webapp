import { useMutation } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from './queryKeys'

type Data = typeof schema['POST /entourages']['data']['entourage']

export function useMutateEntourages() {
  return useMutation((data: Data) => {
    return api.request({
      name: 'POST /entourages',
      data: {
        entourage: data,
      },
    })
  }, {
    refetchQueries: [queryKeys.entourageUsers],
  })
}
