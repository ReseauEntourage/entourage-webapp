import { uniqIntId, uniqStringId } from 'src/utils/misc'
import { FeedState, FeedEntourage, defaultFeedState, FeedAnnouncement } from './feed.reducer'

export function createFeedItem() {
  return {
    itemType: 'Entourage',
    groupType: 'action',
    online: false,
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
    uuid: uniqStringId(),
    title: 'Title',
    location: {
      latitude: 12,
      longitude: 14,
    },
    metadata: {
      googlePlaceId: 'no-place',
    },
  } as FeedEntourage
}

export function createFeedItemList(): FeedEntourage[] {
  return new Array(10).fill(null).map(() => createFeedItem())
}

export const fakeFeedData: FeedState = {
  ...defaultFeedState,
  fetching: false,
  nextPageToken: 'abc',
  itemsUuids: ['abc', 'def'],
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
    def: {
      itemType: 'Announcement',
      action: 'Je découvre',
      author: null,
      body: "Le témoignage quotidien d'une personne SDF qui raconte sa façon de vivre le confinement.",
      iconUrl: 'https://api-preprod.entourage.social/api/v1/announcements/64/icon',
      id: 64,
      imageUrl: 'https://api.entourage.social/assets/announcements/images/64.jpg',
      title: 'Journal du confinement',
      // eslint-disable-next-line max-len
      url: 'entourage-staging://webview?url=https://api-preprod.entourage.social/api/v1/announcements/64/redirect/e59866c68b39596c23bd4d71a7b03241',
      uuid: '64',
    } as FeedAnnouncement,
  },
  selectedItemUuid: null,
} as FeedState
