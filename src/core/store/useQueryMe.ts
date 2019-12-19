import { useQuery } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from './queryKeys'

export function useQueryMe() {
  return useQuery(queryKeys.me, () => api.request({
    name: '/users/me GET',
  }))
}
