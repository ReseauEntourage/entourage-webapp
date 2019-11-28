import { useQuery } from 'react-query'
import { api } from 'src/api'
import { useMapContext } from 'src/components/Map'

export function usePOIs() {
  const mapContext = useMapContext()

  const POIsParams = {
    distance: 5,
    latitude: mapContext.value.center.lat,
    longitude: mapContext.value.center.lng,
    categoryIds: '1,2,3,4,5,6,7',
  }

  const { data, isLoading } = useQuery(['POIs', POIsParams], (params) => api.request({
    routeName: 'GET pois',
    params,
  }))

  return [data, isLoading] as [typeof data, boolean]
}
