import React, { useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useQuery } from 'react-query'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import { api } from 'src/api'
import { constants } from 'src/constants'
import {
  Map, EventMarker, POIMarker, useMapContext,
} from 'src/components/Map'
import { FeedItem } from 'src/components/FeedItem'
// import { LeftCards } from './LeftCards'
import { useOnScroll } from 'src/hooks'
import { AnyToFix } from 'src/types'
import { useActionId } from './useActionId'

function useFeeds() {
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
    routeName: 'GET feeds',
    params,
  }), {
    staleTime: constants.QUERIES_CACHE_TTL,
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

function usePOIs() {
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
  }), {
    staleTime: constants.QUERIES_CACHE_TTL,
  })

  return [data, isLoading] as [typeof data, boolean]
}

interface Props {}

export function MapContainer() {
  const actionId = useActionId()
  const [feeds, feedsLoading, fetchMore] = useFeeds()
  const [POIs] = usePOIs()

  const { onScroll } = useOnScroll(fetchMore)

  const feedsMarkersContent = feeds.map((feed) => {
    const { location, uuid } = feed
    return (
      <div
        key={uuid}
        // @ts-ignore ignore because lat and lng are required for Map children
        lat={location.latitude}
        lng={location.longitude}
      >
        <Link
          href="/actions/[actionId]"
          as={`/actions/${uuid}`}
        >
          <a>
            <EventMarker
              key={uuid}
              isActive={uuid === actionId}
            />
          </a>
        </Link>
      </div>
    )
  })

  const POIsMarkersContent = POIs && POIs.data.pois.map((poi) => (
    <POIMarker
      key={poi.id}
      lat={poi.latitude}
      lng={poi.longitude}
      category={poi.category}
    />
  ))

  const feedsListContent = feeds.map((feed) => {
    const secondText = `
      Créé le ${new Date(feed.createdAt).toLocaleDateString()}
      par ${feed.author.displayName}
    `

    return (
      <li key={feed.uuid}>
        <Link href="/actions/[actionId]" as={`/actions/${feed.uuid}`}>
          <a style={{ textDecoration: 'none' }}>
            <FeedItem
              key={feed.uuid}
              isActive={feed.uuid === actionId}
              primaryText={feed.title}
              secondText={secondText}
              profilePictureURL={feed.author.avatarUrl}
            />
          </a>
        </Link>
      </li>
    )
  })

  const feedsContent = feedsLoading ? (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <CircularProgress variant="indeterminate" />
    </Box>
  ) : (
    <ul>{feedsListContent}</ul>
  )

  return (
    <Box display="flex" height="100%">
      <Box
        width={350}
        overflow="scroll"
        height="100%"
        onScroll={onScroll}
      >
        {feedsContent}
      </Box>
      <Box flex="1" position="relative">
        <Map>
          {POIsMarkersContent}
          {feedsMarkersContent}
        </Map>
        {/* <LeftCards /> */}
      </Box>
    </Box>
  )
}
