import { useQuery } from 'react-query'
import { api } from 'src/network/api'
import { queryKeys } from './queryKeys'

export function useQueryMe() {
  return useQuery(queryKeys.me, () => api.request({
    name: 'GET /users/me',
  }))
}
