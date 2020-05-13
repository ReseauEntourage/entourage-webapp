import Box from '@material-ui/core/Box'
import LocalMallIcon from '@material-ui/icons/LocalMall'
import { formatDistance } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import Link from 'next/link'
import React, { useRef, useEffect } from 'react'
import { useActionId } from '../useActionId'
import { FeedItem, iconStyle } from 'src/components/FeedItem'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { useQueryFeeds, UseQueryFeedItem } from 'src/core/store'
import { colors } from 'src/styles'
import { useOnScroll, useDelayLoading, usePrevious } from 'src/utils/hooks'
import * as UI from './FeedList.styles'
import { SearchCity } from './SearchCity'

function getFeedItemIcon(feedItem: UseQueryFeedItem) {
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

export function FeedList() {
  const actionId = useActionId()
  const [plainFeeds, feedsLoading, fetchMore] = useQueryFeeds()
  const prevFeedsLoading = usePrevious(feedsLoading)
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

  const { onScroll } = useOnScroll({ onScrollBottomEnd: fetchMore })

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

  return (
    <UI.Container>
      <UI.SearchContainer>
        <SearchCity />
      </UI.SearchContainer>
      <UI.FeedContainer
        boxShadow={4}
        width={350}
        zIndex={2}
      >
        <Box
          height="100%"
          onScroll={onScroll}
          overflow="scroll"
          position="relative"
        >
          <ul>{feedsListContent}</ul>
        </Box>
        {isLoading && <OverlayLoader />}
      </UI.FeedContainer>
      <Box />
    </UI.Container>
  )
}
