import { useQuery } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'

export function useQueryMyFeeds() {
  return useQuery(queryKeys.myFeeds, async () => {
    const feedsRes = await api.request({
      name: '/myfeeds GET',
    })

    const feedEntourage = feedsRes.data.feeds.filter((feed) => feed.type === 'Entourage')

    return feedEntourage
  })
}

export type DataQueryMyFeeds = ReturnType<typeof useQueryMyFeeds>['data']
