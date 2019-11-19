import { RequestResponse } from 'src/api'
import { getId } from '../utils'

export function fetchResolver(feedsPayload: RequestResponse<'GET feeds'>) {
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

export type ResourceList = ReturnType<typeof fetchResolver>
export type Resource = ResourceList[0]
