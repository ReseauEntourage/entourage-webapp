import { useQuery } from 'react-query'
import { api } from 'src/network/api'
import { queryKeys } from './queryKeys'

export function useQueryEntourageUsers(entourageId: string) {
  const { data, isLoading } = useQuery([queryKeys.entourageUsers, { entourageId }], (urlParams) => {
    return api.request({
      routeName: 'GET /entourages/:entourageId/users',
      urlParams: {
        entourageId: urlParams.entourageId,
      },
    })
  })

  const users = data ? data.data.users : []

  return [users, isLoading] as [typeof users, boolean]
}
