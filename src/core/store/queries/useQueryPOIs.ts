import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'
import { selectFeedFilters } from 'src/core/useCases/feed'

export function useQueryPOIs() {
  const { center } = useSelector(selectFeedFilters)

  const POIsParams = {
    distance: 5,
    latitude: center.lat,
    longitude: center.lng,
    categoryIds: '1,2,3,4,5,6,7',
  }

  const { data, isLoading } = useQuery([queryKeys.POIs, POIsParams], (params) => api.request({
    name: '/pois GET',
    params,
  }))

  return [data, isLoading] as [typeof data, boolean]
}
