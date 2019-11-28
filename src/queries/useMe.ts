import { useQuery } from 'react-query'
import { api } from 'src/api'
import { queryKeys } from './queryKeys'

export function useQueryMe() {
  return useQuery(queryKeys.me, () => api.request({
    routeName: 'GET /users/me',
  }))
}
