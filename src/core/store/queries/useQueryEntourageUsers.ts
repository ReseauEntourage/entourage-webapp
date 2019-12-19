import { useQuery } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'

export function useQueryEntourageUsers(entourageId: string) {
  const { data, isLoading } = useQuery([queryKeys.entourageUsers, { entourageId }], (pathParams) => {
    return api.request({
      name: '/entourages/:entourageId/users GET',
      pathParams: {
        entourageId: pathParams.entourageId,
      },
    })
  })

  const users = data ? data.data.users : []

  return [users, isLoading] as [typeof users, boolean]
}
