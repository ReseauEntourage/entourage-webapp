import { useMutation } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from 'src/core/store'

type Data = typeof schema['/entourages POST']['data']['entourage']

export function useMutateCreateEntourages() {
  return useMutation((data: Data) => {
    return api.request({
      name: '/entourages POST',
      data: {
        entourage: data,
      },
    })
  }, {
    refetchQueries: [queryKeys.feeds],
  })
}
