import { useQuery } from 'react-query'
import { useMapContext } from 'src/components/Map'
import { api } from 'src/network/api'
import { queryKeys } from './queryKeys'

export function useQueryPOIs() {
  const mapContext = useMapContext()

  const POIsParams = {
    distance: 5,
    latitude: mapContext.value.center.lat,
    longitude: mapContext.value.center.lng,
    categoryIds: '1,2,3,4,5,6,7',
  }

  const { data, isLoading } = useQuery([queryKeys.POIs, POIsParams], (params) => api.request({
    name: 'GET /pois',
    params,
  }))

  return [data, isLoading] as [typeof data, boolean]
}
