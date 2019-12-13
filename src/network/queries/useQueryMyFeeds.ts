import { useQuery } from 'react-query'
import { api } from 'src/network/api'
import { queryKeys } from './queryKeys'

export function useQueryMyFeeds() {
  return useQuery(queryKeys.myFeeds, () => api.request({
    name: 'GET /myfeeds',
  }))
}
