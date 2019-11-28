import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { api } from 'src/network/api'
import { AnyToFix } from 'src/types'
import { useMapContext } from 'src/components/Map'

export function useQueryFeeds() {
  const mapContext = useMapContext()

  const feedsParams = useMemo(() => ({
    timeRange: 36000,
    latitude: mapContext.value.center.lat,
    longitude: mapContext.value.center.lng,
    pageToken: undefined as string | undefined,
  }), [mapContext.value.center.lat, mapContext.value.center.lng])

  const {
    data: pages,
    isLoading,
    fetchMore,
    isFetchingMore,
  } = useQuery(['feeds', feedsParams], (params) => api.request({
    routeName: 'GET /feeds',
    params,
  }), {
    paginated: true,
    getCanFetchMore: (lastPage: AnyToFix) => {
      return lastPage.data.nextPageToken
    },
  })

  const fetchModeWithParams = useCallback(() => {
    if (!pages || isFetchingMore) return
    const currentPage = pages[pages.length - 1]
    const { nextPageToken } = currentPage.data
    fetchMore({ ...feedsParams, pageToken: nextPageToken })
  }, [pages, isFetchingMore, fetchMore, feedsParams])

  const feeds = !pages
    ? []
    : pages
      .map((res) => res.data.feeds)
      .reduce((pageA, pageB) => [...pageA, ...pageB], [])
      .map((feed) => feed.data)

  return [feeds, isLoading, fetchModeWithParams] as [typeof feeds, boolean, typeof fetchMore]
}
