import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Map } from 'src/components/Map'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { feedActions } from 'src/core/useCases/feed'
import { useI18n } from 'src/i18n'
import { useMount } from 'src/utils/hooks'
import { FeedList } from './FeedList'
import * as S from './MapContainer.styles'
import { RightCards } from './RightCards'
import { useActionId } from './useActionId'
import { useCurrentFeedItem } from './useCurrentFeedItem'
import { useMarkers } from './useMarkers'

export function MapContainerMobile() {
  const texts = useI18n()

  const dispatch = useDispatch()
  const actionId = useActionId()
  const { feedsMarkersContent, POIsMarkersContent, isLoading } = useMarkers()
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false)
  const currentFeedItem = useCurrentFeedItem()

  useMount(() => {
    if (!actionId) {
      dispatch(feedActions.retrieveFeed())
    }
  })

  if (currentFeedItem) {
    return (
      <S.Container>
        <RightCards key={actionId} />
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
        <>
          <FeedList />
          <S.FabFeed color="primary" onClick={() => setIsMapOpen(true)} size="small" variant="extended">
            <S.NavIcon />
            {texts.content.navActions.mapButton}
          </S.FabFeed>
        </>
      ) }

    </S.Container>
  )
}
