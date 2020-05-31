import React from 'react'
import { Map } from 'src/components/Map'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { useMainStore } from 'src/containers/MainStore'
import { FeedList } from './FeedList'
import * as S from './MapContainer.styles'
import { RightCards } from './RightCards'
import { useActionId } from './useActionId'
import { useFeeds } from './useFeeds'
import { useMarkers } from './useMarkers'

interface MapContainer {}

export function MapContainerDesktop() {
  const actionId = useActionId()
  const mainContext = useMainStore()
  const { feeds } = useFeeds()
  const { feedsMarkersContent, POIsMarkersContent, isLoading } = useMarkers()

  const selectedFeedItemFromFeed = feeds.find((feedItem) => feedItem.uuid === actionId)
  const prevFeedItem = mainContext.feedItem
  const currentFeedItem = actionId
    ? (selectedFeedItemFromFeed || prevFeedItem)
    : null

  return (
    <S.Container>
      <FeedList />
      <S.MapContainer>
        <Map>
          {POIsMarkersContent}
          {feedsMarkersContent}
        </Map>
        {isLoading && <OverlayLoader />}
      </S.MapContainer>
      {currentFeedItem && (
        <S.RightCardsContainer
          boxShadow={4}
        >
          <RightCards
            key={actionId}
            feedItem={currentFeedItem}
          />
        </S.RightCardsContainer>
      )}
    </S.Container>
  )
}
