import uniqid from 'uniqid'
import { uniqIntId } from 'src/utils/misc'
import { FeedState, FeedEntourage, defaultFeedState } from './feed.reducer'

export function createFeedItem() {
  return {
    itemType: 'Entourage',
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
  } as FeedEntourage
}

/*

 */

export function createFeedItemList(): FeedEntourage[] {
  return new Array(10).fill(null).map(() => createFeedItem())
}

export const fakeFeedData = {
  ...defaultFeedState,
  fetching: false,
  nextPageToken: 'abc',
  itemsUuids: ['abc'],
  items: {
    abc: {
      itemType: 'Entourage',
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
    } as FeedEntourage,
  },
  selectedItemUuid: null,
} as FeedState
