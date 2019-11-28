import { useQuery } from 'react-query'
import { api } from 'src/api'

export function useEntourageUsers(entourageId: string) {
  const { data, isLoading } = useQuery(['entourage-users', { entourageId }], (urlParams) => {
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
