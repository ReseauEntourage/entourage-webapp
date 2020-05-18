import { useQuery } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'

export function useQueryUser(userId: number) {
  return useQuery(
    queryKeys.user(userId),
    () => {
      return api.request({
        name: '/users/:id GET',
        pathParams: {
          userId,
        },
      })
    },
  )
}
