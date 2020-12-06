import uniqid from 'uniqid'
import { uniqIntId } from 'src/utils/misc'
import { FeedState, FeedItem, defaultFeedState } from './feed.reducer'

export function createFeedItem() {
  return {
    author: {
      id: uniqIntId(),
      avatarUrl: '...',
      displayName: 'Guillaume',
      partner: null,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'Description',
    id: uniqIntId(),
    uuid: uniqid(),
    title: 'Title',
    location: {
      latitude: 12,
      longitude: 14,
    },
    metadata: {},
  } as FeedItem
}

export function createFeedItemList(): FeedItem[] {
  return new Array(10).fill(null).map(() => createFeedItem())
}

export const fakeFeedData = {
  ...defaultFeedState,
  fetching: false,
  filters: {
    cityName: 'New York',
    center: {
      lat: 0,
      lng: 0,
    },
    zoom: 12,
  },
  nextPageToken: 'abc',
  items: ['abc'],
  cacheItems: {
    abc: {
      author: {
        avatarUrl: 'http://image.com',
        displayName: 'John',
        id: 1,
      },
      createdAt: new Date().toISOString(),
      description: 'feed description',
      id: 1,
      uuid: 'abc',
      title: 'feed title',
      location: {
        latitude: 2,
        longitude: 2,
      },
      metadata: {},
    } as FeedItem,
  },
  selectedItemUuid: null,
} as FeedState
