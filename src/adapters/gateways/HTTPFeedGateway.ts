import { constants } from 'src/constants'
import { api, FeedItemEntourage } from 'src/core/api'
import { IFeedGateway } from 'src/core/useCases/feed'
import { assertCondition } from 'src/utils/misc'
import { ResolvedValue } from 'src/utils/types'

export class HTTPFeedGateway implements IFeedGateway {
  private cache: {
    [key: string]: {
      time: number;
      content: ResolvedValue<ReturnType<IFeedGateway['retrieveFeedItems']>>;
    };
  } = {}

  retrieveFeedItems: IFeedGateway['retrieveFeedItems'] = (data) => {
    const key = JSON.stringify(data)
    const cacheItem = this.cache[key]

    if (cacheItem) {
      const cacheIsOutdated = (Date.now() - cacheItem.time) > constants.FEED_ITEM_CACHE_TTL_SECONDS
      if (!cacheIsOutdated) {
        return Promise.resolve(cacheItem.content)
      }
    }

    return api.request({
      name: '/feeds GET',
      params: {
        types: data.filters.types,
        timeRange: data.filters.timeRange,
        latitude: data.filters.location.center.lat,
        longitude: data.filters.location.center.lng,
        pageToken: data.nextPageToken ?? undefined,
        announcements: 'v1',
      },
    }).then((res) => {
      const { nextPageToken, feeds } = res.data
      const items = feeds.map((item) => {
        assertCondition(item.type === 'Entourage' || item.type === 'Announcement')

        if (item.type === 'Announcement') {
          return {
            itemType: item.type,
            id: item.data.id,
            uuid: item.data.uuid,
            title: item.data.title,
            body: item.data.body,
            imageUrl: item.data.imageUrl,
            action: item.data.action,
            url: item.data.url,
            webappUrl: item.data.webappUrl,
            iconUrl: item.data.iconUrl,
          }
        }

        return {
          itemType: item.type,
          author: {
            id: item.data.author.id,
            partner: item.data.author.partner,
            avatarUrl: item.data.author.avatarUrl,
            displayName: item.data.author.displayName,
          },
          createdAt: item.data.createdAt,
          updatedAt: item.data.updatedAt,
          title: item.data.title,
          description: item.data.description,
          id: item.data.id,
          uuid: item.data.uuid,
          location: item.data.location,
          metadata: item.data.metadata,
          entourageType: item.data.entourageType,
          groupType: item.data.groupType,
          displayCategory: item.data.displayCategory,
          joinStatus: item.data.joinStatus,
          status: item.data.status,
          online: item.data.online,
          eventUrl: item.data.eventUrl,
          numberOfPeople: item.data.numberOfPeople,
          postalCode: item.data.postalCode,
          numberOfUnreadMessages: item.data.numberOfUnreadMessages,
          shareUrl: item.data.shareUrl,
        }
      })

      const content = {
        nextPageToken: nextPageToken ?? null,
        items,
      }

      this.cache[key] = {
        time: Date.now(),
        content,
      }

      return content
    })
  }

  retrieveFeedItem(data: { entourageUuid: string; }) {
    return api.request({
      name: '/entourages/:entourageId GET',
      pathParams: {
        entourageUuid: data.entourageUuid,
      },
    }).then((item) => {
      return {
        displayAddress: item.data.entourage.metadata.displayAddress,
        center: {
          lat: item.data.entourage.location.latitude,
          lng: item.data.entourage.location.longitude,
        },
        item: {
          itemType: 'Entourage' as FeedItemEntourage['type'],
          author: {
            id: item.data.entourage.author.id,
            partner: item.data.entourage.author.partner,
            avatarUrl: item.data.entourage.author.avatarUrl,
            displayName: item.data.entourage.author.displayName,
          },
          createdAt: item.data.entourage.createdAt,
          updatedAt: item.data.entourage.updatedAt,
          title: item.data.entourage.title,
          description: item.data.entourage.description,
          id: item.data.entourage.id,
          uuid: item.data.entourage.uuid,
          location: item.data.entourage.location,
          metadata: item.data.entourage.metadata,
          entourageType: item.data.entourage.entourageType,
          groupType: item.data.entourage.groupType,
          displayCategory: item.data.entourage.displayCategory,
          joinStatus: item.data.entourage.joinStatus,
          status: item.data.entourage.status,
          online: item.data.entourage.online,
          eventUrl: item.data.entourage.eventUrl,
          numberOfPeople: item.data.entourage.numberOfPeople,
          postalCode: item.data.entourage.postalCode,
          numberOfUnreadMessages: item.data.entourage.numberOfUnreadMessages,
          shareUrl: item.data.entourage.shareUrl,
        },
      }
    })
  }

  createEntourage: IFeedGateway['createEntourage'] = (entourage) => {
    return api.request({
      name: '/entourages POST',
      data: { entourage },
    }).then(({ data }) => {
      return {
        ...data.entourage,
        itemType: 'Entourage',
      }
    })
  }

  updateEntourage: IFeedGateway['updateEntourage'] = (entourageUuid, entourage) => {
    return api.request({
      name: '/entourages PATCH',
      pathParams: { entourageUuid },
      data: { entourage },
    }).then(({ data }) => {
      return {
        ...data.entourage,
        itemType: 'Entourage',
      }
    })
  }

  joinEntourage: IFeedGateway['joinEntourage'] = (entourageUuid: string) => {
    return api.request({
      name: '/entourages/:entourageId/users POST',
      pathParams: {
        entourageUuid,
      },
    }).then((data) => {
      return {
        status: data.data.user.status,
      }
    })
  }

  leaveEntourage(entourageUuid: string, userId: number): Promise<void | null> {
    return api.request({
      name: '/entourages/:entourageId/users/:userId DELETE',
      pathParams: {
        userId,
        entourageUuid,
      },
    }).then(() => {
      return null
    })
  }

  closeEntourage(entourageUuid: string, success: boolean): Promise<void |null> {
    return api.request({
      name: '/entourages PATCH',
      data: {
        entourage: {
          status: 'closed',
          outcome: {
            success,
          },
        },
      },
      pathParams: {
        entourageUuid,
      },
    }).then(() => {
      return null
    })
  }

  reopenEntourage(entourageUuid: string): Promise<void |null> {
    return api.request({
      name: '/entourages PATCH',
      data: {
        entourage: {
          status: 'open',
        },
      },
      pathParams: {
        entourageUuid,
      },
    }).then(() => {
      return null
    })
  }

  retrieveEventImages: IFeedGateway['retrieveEventImages'] = () => {
    return api.request({
      name: '/entourage_images GET',
    }).then(({ data }) => {
      const images = data.entourageImages.map((image) => {
        return {
          id: image.id,
          title: image.title,
          landscapeUrl: image.landscapeUrl,
          landscapeSmallUrl: image.landscapeSmallUrl,
          portraitUrl: image.portraitUrl ?? undefined,
          portraitSmallUrl: image.portraitSmallUrl ?? undefined,
        }
      })

      return {
        eventImages: images,
      }
    })
  }
}
