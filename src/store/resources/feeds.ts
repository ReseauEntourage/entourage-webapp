import { AxiosResponse } from 'axios'
import { getRequestHash, useRequest } from 'react-resources-store'
import { Parameters } from 'src/types'
import { RequestResponse } from 'src/api'
import { getId } from '../utils'
import { ActionResource } from '../types'

export function feedsResolver(feedsPayload: RequestResponse<'GET feeds'>) {
  const feeds = feedsPayload.feeds.map((feed) => ({
    author: feed.data.author,
    createdAt: feed.data.createdAt,
    description: feed.data.description,
    id: getId(feed.data),
    location: feed.data.location,
    title: feed.data.title,
  }))

  return feeds
}

export type FeedResourceList = ReturnType<typeof feedsResolver>
export type FeedResource = FeedResourceList[0]

type UpdateFeedParam = Parameters<typeof feedsResolver>[0]

export function fetchFeeds(res: AxiosResponse<UpdateFeedParam>): ActionResource {
  return {
    key: '@@REACT_RESOURCES_HOOK',
    type: 'UPDATE_SUCCEEDED',
    resourceType: 'feeds',
    requestKey: getRequestHash(res.config.url || '', res.config.method || '', res.config.params),
    payload: feedsResolver(res.data),
  }
}

export function useReadFeeds(requestKey: string) {
  return useRequest<FeedResourceList>({
    resourceType: 'feeds',
    requestKey,
  }, { fetchPolicy: 'cache-only' })
}
