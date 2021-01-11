import uniqid from 'uniqid'
import { Entourage, User } from '../entities/models'
import { uniqIntId } from 'src/utils/misc'

export function createUser(): User {
  return {
    id: uniqIntId(),
    avatarUrl: '...',
    displayName: 'Guillaume',
    partner: null,
  }
}

export function createEntourage(): Entourage {
  return {
    type: 'Entourage',
    heatmapSize: 0,
    data: {
      author: uniqIntId(),
      createdAt: new Date().toISOString(),
      description: '',
      displayCategory: 'event',
      entourageType: 'contribution',
      groupType: 'action',
      id: uniqIntId(),
      joinStatus: 'not_requested',
      location: {
        latitude: 12,
        longitude: 14,
      },
      metadata: {
        displayAddress: '',
        streetAddress: '',
        startsAt: '',
        placeName: '',
        googlePlaceId: '',
        endsAt: '',
      },
      numberOfPeople: 12,
      numberOfUnreadMessages: null,
      public: false,
      shareUrl: '',
      status: 'closed',
      title: '',
      updatedAt: new Date().toISOString(),
      uuid: uniqid(),
    },
  }
}

export function createEntourageWithAuthor() {
  const entourage = createEntourage()

  return {
    ...entourage,
    data: {
      ...entourage.data,
      author: createUser(),
    },
  }
}
