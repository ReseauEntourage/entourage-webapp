import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import LocalMallIcon from '@material-ui/icons/LocalMall'
import { formatDistance } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import Link from 'next/link'
import React from 'react'
import { FeedItem, iconStyle } from 'src/components/FeedItem'
import { Map, EventMarker, POIMarker, MarkerWrapper } from 'src/components/Map'
import { useMainContext } from 'src/containers/MainContext'
import { schema } from 'src/core/api'
import { useQueryPOIs, useQueryFeeds } from 'src/core/store'
import { colors } from 'src/styles'
import { useOnScroll } from 'src/utils/hooks'
import { LeftCards } from './LeftCards'
import { useActionId } from './useActionId'

function getFeedItemIcon(feedItem: typeof schema['GET /feeds']['response']['feeds'][0]['data']) {
  const { entourageType, displayCategory } = feedItem
  if (entourageType === 'contribution') {
    const backgroundColor = colors.main.primary
    if (displayCategory === 'mat_help') {
      return <LocalMallIcon style={{ ...iconStyle, color: '#fff', backgroundColor }} />
    } if (displayCategory === 'info') {
      // TODO
    }
  }

  if (entourageType === 'ask_for_help') {
    // TODO
  }

  return undefined
}

interface MapContainer {}

export function MapContainer() {
  const actionId = useActionId()
  const mainContext = useMainContext()
  const [feeds, feedsLoading, fetchMore] = useQueryFeeds()
  const [POIs] = useQueryPOIs()

  const { onScroll } = useOnScroll(fetchMore)

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

  const feedsListContent = feeds.map((feed) => {
    const createAtDistance = formatDistance(new Date(feed.createdAt), new Date(), { locale: fr })
    const secondText = `
      Créé il y a ${createAtDistance}
      par ${feed.author.displayName}
    `

    return (
      <li key={feed.uuid}>
        <Link as={`/actions/${feed.uuid}`} href="/actions/[actionId]">
          <a style={{ textDecoration: 'none' }}>
            <FeedItem
              key={feed.uuid}
              icon={getFeedItemIcon(feed)}
              isActive={feed.uuid === actionId}
              primaryText={feed.title}
              profilePictureURL={feed.author.avatarUrl}
              secondText={secondText}
            />
          </a>
        </Link>
      </li>
    )
  })

  const feedsContent = feedsLoading ? (
    <Box alignItems="center" display="flex" height="100%" justifyContent="center">
      <CircularProgress variant="indeterminate" />
    </Box>
  ) : (
    <ul>{feedsListContent}</ul>
  )

  return (
    <Box display="flex" height="100%">
      <Box
        boxShadow={4}
        height="100%"
        onScroll={onScroll}
        overflow="scroll"
        width={350}
        zIndex={2}
      >
        {feedsContent}
      </Box>
      <Box
        flex="1"
        position="relative"
        zIndex={1}
      >
        <Map>
          {POIsMarkersContent}
          {feedsMarkersContent}
        </Map>
      </Box>
      {currentFeedItem && (
        <Box
          boxShadow={4}
          width={500}
          zIndex={2}
        >
          <LeftCards
            key={actionId}
            feedItem={currentFeedItem}
          />
        </Box>
      )}
    </Box>
  )
}
