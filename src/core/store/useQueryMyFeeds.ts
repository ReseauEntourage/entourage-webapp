import { useQuery } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from './queryKeys'

export function useQueryMyFeeds() {
  return useQuery(queryKeys.myFeeds, () => api.request({
    name: '/myfeeds GET',
  }))
}

export type DataQueryMyFeeds = ReturnType<typeof useQueryMyFeeds>['data']
