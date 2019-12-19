import { useMutation } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from './queryKeys'

type PathParams = Parameters<typeof schema['POST /entourages/:entourageId/users']['url']>[0]

export function useMutateEntourageUsers() {
  return useMutation((pathParams: PathParams) => {
    return api.request({
      name: 'POST /entourages/:entourageId/users',
      pathParams,
    })
  }, {
    refetchQueries: [queryKeys.feeds],
  })
}
