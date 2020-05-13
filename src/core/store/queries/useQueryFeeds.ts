import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useMapContext } from 'src/components/Map'
import { constants } from 'src/constants'
import { api, FeedItemEntourage } from 'src/core/api'
import { queryKeys } from 'src/core/store'
import { AnyToFix } from 'src/utils/types'

export function useQueryFeeds() {
  const mapContext = useMapContext()

  const feedsParams = useMemo(() => ({
    timeRange: constants.MAX_FEED_ITEM_UPDATED_AT_HOURS,
    latitude: mapContext.value.center.lat,
    longitude: mapContext.value.center.lng,
    pageToken: undefined as string | undefined,
    // temporary set feed types in order to include only Entourage type and exclude Tour type
    types: 'as,ae,am,ar,ai,ak,ao,cs,ce,cm,cr,ci,ck,co,ou',
  }), [mapContext.value.center.lat, mapContext.value.center.lng])

  const {
    data: pages,
    isLoading,
    fetchMore,
    isFetchingMore,
    canFetchMore,
  } = useQuery([queryKeys.feeds, feedsParams], (params) => api.request({
    name: '/feeds GET',
    params,
  }), {
    paginated: true,
    getCanFetchMore: (lastPage: AnyToFix) => {
      return lastPage.data.nextPageToken
    },
  })

  const fetchModeWithParams = useCallback(() => {
    if (!pages || isFetchingMore || !canFetchMore) return
    const currentPage = pages[pages.length - 1]
    const { nextPageToken } = currentPage.data
    fetchMore({ ...feedsParams, pageToken: nextPageToken })
  }, [pages, isFetchingMore, canFetchMore, fetchMore, feedsParams])

  const feeds = !pages
    ? []
    : pages
      .map((res) => res.data.feeds)
      .reduce((pageA, pageB) => [...pageA, ...pageB], [])
      .map((feed) => feed.data as FeedItemEntourage['data'])

  return [feeds, isLoading, fetchModeWithParams] as [typeof feeds, boolean, typeof fetchMore]
}

export type UseQueryFeedItem = ReturnType<typeof useQueryFeeds>[0][0]
