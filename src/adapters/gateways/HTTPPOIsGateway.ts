import { constants } from 'src/constants'
import { api } from 'src/core/api'
import { IPOIsGateway } from 'src/core/useCases/pois'
import { ResolvedValue } from 'src/utils/types'

export class HTTPPOIsGateway implements IPOIsGateway {
  private cache: {
    [key: string]: {
      time: number;
      content: ResolvedValue<ReturnType<IPOIsGateway['retrievePOIs']>>;
    };
  } = {}

  retrievePOIs: IPOIsGateway['retrievePOIs'] = (data) => {
    const key = JSON.stringify(data)
    const cacheItem = this.cache[key]

    if (cacheItem) {
      const cacheIsOutdated = (Date.now() - cacheItem.time) > constants.FEED_ITEM_CACHE_TTL_SECONDS
      if (!cacheIsOutdated) {
        return Promise.resolve(cacheItem.content)
      }
    }

    return api.ssr().request({
      name: '/pois GET',
      params: {
        v: 2,
        distance: data.filters.location.distance,
        longitude: data.filters.location.center.lng,
        latitude: data.filters.location.center.lat,
        categoryIds: data.filters.categories,
        partnersFilters: data.filters.partners,
      },
    }).then((res) => {
      const { pois } = res.data
      const items = pois.map((poi) => {
        return {
          uuid: poi.uuid,
          name: poi.name,
          longitude: poi.longitude,
          latitude: poi.latitude,
          address: poi.address,
          phone: poi.phone,
          partnerId: poi.partnerId,
          categoryId: poi.categoryId,
        }
      })

      const content = {
        pois: items,
      }

      this.cache[key] = {
        time: Date.now(),
        content,
      }

      return content
    })
  }

  retrievePOI: IPOIsGateway['retrievePOI'] = (data) => {
    return api.ssr().request({
      name: '/pois/:poiUuid GET',
      params: {
        v: 2,
      },
      pathParams: {
        poiUuid: data.poiUuid,
      },
    }).then((res) => {
      const { poi } = res.data

      const details = {
        uuid: poi.uuid,
        name: poi.name,
        longitude: poi.longitude,
        latitude: poi.latitude,
        address: poi.address,
        phone: poi.phone,
        description: poi.description,
        categoryIds: poi.categoryIds,
        partnerId: poi.partnerId,
        website: poi.website,
        email: poi.email,
        hours: poi.hours,
        languages: poi.languages,
        audience: poi.audience,
        source: poi.source,
        sourceUrl: poi.sourceUrl,
      }

      return {
        poiDetails: details,
      }
    })
  }
}
