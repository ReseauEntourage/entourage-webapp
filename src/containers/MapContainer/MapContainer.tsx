import Box from '@material-ui/core/Box'
import Link from 'next/link'
import React, { useRef, useEffect } from 'react'
import { Map, EventMarker, POIMarker, MarkerWrapper } from 'src/components/Map'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { useMainStore } from 'src/containers/MainStore'
import { useQueryPOIs, useQueryFeeds } from 'src/core/store'
import { useDelayLoading, usePrevious } from 'src/utils/hooks'
import { FeedList } from './FeedList'
import { RightCards } from './RightCards'
import { useActionId } from './useActionId'

interface MapContainer {}

export function MapContainer() {
  const actionId = useActionId()
  const mainContext = useMainStore()
  const [plainFeeds, feedsLoading] = useQueryFeeds()
  const prevFeedsLoading = usePrevious(feedsLoading)
  const [POIs] = useQueryPOIs()
  const lastFeedsRef = useRef<typeof plainFeeds>()
  const [isLoading, setIsLoading] = useDelayLoading()

  if (!feedsLoading) {
    lastFeedsRef.current = plainFeeds
  }

  useEffect(() => {
    if (prevFeedsLoading && !feedsLoading) {
      setIsLoading(false)
    } else if (feedsLoading && !prevFeedsLoading) {
      setIsLoading(true)
    }
  }, [feedsLoading, prevFeedsLoading, setIsLoading])

  const feeds = feedsLoading ? (lastFeedsRef.current || []) : plainFeeds

  const selectedFeedItemFromFeed = feeds.find((feedItem) => feedItem.uuid === actionId)
  const prevFeedItem = mainContext.feedItem
  const currentFeedItem = actionId
    ? (selectedFeedItemFromFeed || prevFeedItem)
    : null

  const feedsMarkersContent = feeds.map((feed) => {
    const { location, uuid } = feed
    return (
      <MarkerWrapper
        key={uuid}
        lat={location.latitude}
        lng={location.longitude}
      >
        <Link
          as={`/actions/${uuid}`}
          href="/actions/[actionId]"
        >
          <a>
            <EventMarker
              key={uuid}
              isActive={uuid === actionId}
            />
          </a>
        </Link>
      </MarkerWrapper>
    )
  })

  const POIsMarkersContent = POIs && POIs.data.pois.map((poi) => (
    <MarkerWrapper
      key={poi.id}
      lat={poi.latitude}
      lng={poi.longitude}
    >
      <POIMarker
        category={poi.category}
      />
    </MarkerWrapper>
  ))

  return (
    <Box display="flex" height="100%">
      <FeedList />
      <Box
        flex="1"
        position="relative"
        zIndex={1}
      >
        <Map>
          {POIsMarkersContent}
          {feedsMarkersContent}
        </Map>
        {isLoading && <OverlayLoader />}
      </Box>
      {currentFeedItem && (
        <Box
          boxShadow={4}
          width={500}
          zIndex={2}
        >
          <RightCards
            key={actionId}
            feedItem={currentFeedItem}
          />
        </Box>
      )}
    </Box>
  )
}
