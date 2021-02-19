import { constants } from 'src/constants'
import { api } from 'src/core/api'
import { IFeedGateway } from 'src/core/useCases/feed'
import { assertCondition, formatTypes } from 'src/utils/misc'
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

    const types = formatTypes(data.filters.types)

    return api.request({
      name: '/feeds GET',
      params: {
        types,
        timeRange: constants.MAX_FEED_ITEM_UPDATED_AT_HOURS,
        latitude: data.filters.position.center.lat,
        longitude: data.filters.position.center.lng,
        pageToken: data.nextPageToken ?? undefined,
      },
    }).then((res) => {
      const { nextPageToken, feeds } = res.data
      const items = feeds.map((item) => {
        assertCondition(item.type === 'Entourage')

        return {
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

  retrieveFeedItem(data: { entourageUuid: string; }) {
    return api.request({
      name: '/entourages/:entourageId GET',
      pathParams: {
        entourageUuid: data.entourageUuid,
      },
    }).then((res) => {
      return {
        cityName: res.data.entourage.metadata.city,
        center: {
          lat: res.data.entourage.location.latitude,
          lng: res.data.entourage.location.longitude,
        },
      }
    })
  }
}
