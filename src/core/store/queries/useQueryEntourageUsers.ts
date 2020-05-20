import { useQuery } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'

export function useQueryEntourageUsers(entourageUuid: string) {
  const { data, isLoading } = useQuery([queryKeys.entourageUsers, { entourageUuid }], (pathParams) => {
    return api.request({
      name: '/entourages/:entourageId/users GET',
      pathParams: {
        entourageUuid: pathParams.entourageUuid,
      },
    })
  })

  const users = data ? data.data.users : []

  return [users, isLoading] as [typeof users, boolean]
}
