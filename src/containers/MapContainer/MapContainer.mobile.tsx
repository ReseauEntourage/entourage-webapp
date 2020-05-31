import React, { useState } from 'react'
import { Map } from 'src/components/Map'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { useMainStore } from 'src/containers/MainStore'
import { texts } from 'src/i18n'
import { FeedList } from './FeedList'
import * as S from './MapContainer.styles'
import { RightCards } from './RightCards'
import { useActionId } from './useActionId'
import { useFeeds } from './useFeeds'
import { useMarkers } from './useMarkers'

interface MapContainer {}

export function MapContainerMobile() {
  const actionId = useActionId()
  const mainContext = useMainStore()
  const { feeds } = useFeeds()
  const { feedsMarkersContent, POIsMarkersContent, isLoading } = useMarkers()
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false)

  const selectedFeedItemFromFeed = feeds.find((feedItem) => feedItem.uuid === actionId)
  const prevFeedItem = mainContext.feedItem
  const currentFeedItem = actionId
    ? (selectedFeedItemFromFeed || prevFeedItem)
    : null

  if (currentFeedItem) {
    return (
      <S.Container>
        <RightCards
          key={actionId}
          feedItem={currentFeedItem}
        />

      </S.Container>
    )
  }

  return (
    <S.Container>
      { isMapOpen ? (
        <S.MapContainer>
          <Map>
            {POIsMarkersContent}
            {feedsMarkersContent}
          </Map>
          {isLoading && <OverlayLoader />}
          <S.FabMap color="primary" onClick={() => setIsMapOpen(false)} size="small" variant="extended">
            <S.ReturnIcon />
            {texts.content.navActions.returnButton}
          </S.FabMap>

        </S.MapContainer>
      ) : (
        <><FeedList />
          <S.FabFeed color="primary" onClick={() => setIsMapOpen(true)} size="small" variant="extended">
            <S.NavIcon />
            {texts.content.navActions.mapButton}
          </S.FabFeed>
        </>
      ) }

    </S.Container>
  )
}
