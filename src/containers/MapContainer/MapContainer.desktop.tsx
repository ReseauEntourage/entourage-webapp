import React from 'react'
import { useDispatch } from 'react-redux'
import { Map } from 'src/components/Map'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { feedActions } from 'src/coreLogic/useCases/feed'
import { useMount } from 'src/utils/hooks'
import { FeedList } from './FeedList'
import * as S from './MapContainer.styles'
import { RightCards } from './RightCards'
import { useActionId } from './useActionId'
import { useCurrentFeedItem } from './useCurrentFeedItem'
import { useMarkers } from './useMarkers'

export function MapContainerDesktop() {
  const dispatch = useDispatch()
  const actionId = useActionId()
  const { feedsMarkersContent, POIsMarkersContent, isLoading } = useMarkers()
  const currentFeedItem = useCurrentFeedItem()

  useMount(() => {
    if (!actionId) {
      dispatch(feedActions.retrieveFeed())
    }
  })

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
        <S.RightCardsContainer boxShadow={4}>
          <RightCards key={actionId} />
        </S.RightCardsContainer>
      )}
    </S.Container>
  )
}
