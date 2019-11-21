import React from 'react'
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
import { useRouter } from 'next/dist/client/router'

function useFeeds() {
  const mapContext = useMapContext()

  const feedsParams = {
    timeRange: 36000,
    latitude: mapContext.value.center.lat,
    longitude: mapContext.value.center.lng,
  }

  const { data, isLoading } = useQuery(['feeds', feedsParams], (params) => api.request({
    routeName: 'GET feeds',
    params,
  }), { staleTime: constants.QUERIES_CACHE_TTL })

  return [data, isLoading] as [typeof data, boolean]
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
  }), { staleTime: constants.QUERIES_CACHE_TTL })

  return [data, isLoading] as [typeof data, boolean]
}

interface Props {}

export function MapContainer() {
  const router = useRouter()
  const [feeds, feedsLoading] = useFeeds()
  const [POIs] = usePOIs()

  const feedsMarkersContent = feeds && feeds.data.feeds.map((feed) => {
    const { location, uuid } = feed.data
    return (
      <Link
        key={uuid}
        href="/actions/[actionId]"
        as={`/actions/${uuid}`}
        // @ts-ignore ignore because lat and lng are required for Map children
        lat={location.latitude}
        lng={location.longitude}
      >
        <a>
          <EventMarker
            key={uuid}
            isActive={uuid === router.query.actionId}
          />
        </a>
      </Link>
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

  const feedsContent = feeds && feeds.data.feeds.map((feed) => {
    const secondText = `
      Créé le ${new Date(feed.data.createdAt).toLocaleDateString()}
      par ${feed.data.author.displayName}
    `

    return (
      <li>
        <Link href="/actions/[actionId]" as={`/actions/${feed.data.uuid}`}>
          <a style={{ textDecoration: 'none' }}>
            <FeedItem
              key={feed.data.uuid}
              isActive={feed.data.uuid === router.query.actionId}
              primaryText={feed.data.title}
              secondText={secondText}
              profilePictureURL={feed.data.author.avatarUrl}
            />
          </a>
        </Link>
      </li>
    )
  })

  return (
    <Box display="flex" height="100%">
      <Box width={350} overflow="scroll" height="100%">
        {feedsLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress variant="indeterminate" />
          </Box>
        ) : (
          <ul>{feedsContent}</ul>
        )}
      </Box>
      <Box flex="1">
        <Map>
          {POIsMarkersContent}
          {feedsMarkersContent}
        </Map>
      </Box>
    </Box>
  )
}
