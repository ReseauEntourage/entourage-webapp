import { useMutation } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from 'src/core/store'

type PathParams = Parameters<typeof schema['/entourages/:entourageId/users POST']['url']>[0]

export function useMutateEntourageUsers() {
  return useMutation((pathParams: PathParams) => {
    return api.request({
      name: '/entourages/:entourageId/users POST',
      pathParams,
    })
  }, {
    refetchQueries: [queryKeys.feeds],
  })
}
