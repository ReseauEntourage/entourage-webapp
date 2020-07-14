import { from } from 'rxjs'
import { EntourageGateway } from '../../coreLogic/gateways/EntourageGateway.interface'
import { api } from 'src/core/api'

export class HTTPEntourageGateway implements EntourageGateway {
  authenticateUser() {
    return from(api.request({
      name: '/users/me GET',
    }).then((res) => {
      const { user } = res.data

      if (!user.id) return null

      return {
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        uuid: user.uuid,
      }
    }))
  }

  retrieveFeed(
    filters: {
      center: { lat: number; lng: number; };
      zoom: number;
    },
    nextPageToken: string | null,
  ) {
    return from(api.request({
      name: '/feeds GET',
      params: {
        pageToken: nextPageToken || undefined,
        latitude: filters.center.lat,
        longitude: filters.center.lng,
      },
    }).then((res) => {
      const items = res.data.feeds
        .map((item) => item.data)
        .map((item) => {
          return {
            author: {
              avatarUrl: item.author.avatarUrl,
            },
            createdAt: item.createdAt,
            description: item.description,
            id: item.uuid,
            title: item.title,
          }
        })

      return {
        nextPageToken: res.data.nextPageToken || null,
        items,
      }
    }))
  }
}
