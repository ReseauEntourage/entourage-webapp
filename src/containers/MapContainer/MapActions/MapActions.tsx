import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeedList } from '../LeftLists'
import { FeedFilters } from '../LeftLists/Filters'
import { FeedItemCards } from '../RightCards/FeedItemCards'
import { useActionId } from '../useActionId'
import { useOnNoContentOnMap } from '../useOnNoContentOnMap'
import { SplashScreen } from 'src/components/SplashScreen'
import { MapContainer } from 'src/containers/MapContainer'
import { ModalNoContent } from 'src/containers/ModalNoContent'

import { feedActions, selectFeedIsFetching, selectFeedIsIdle } from 'src/core/useCases/feed'
import { texts } from 'src/i18n'
import { useFirebase, useMount } from 'src/utils/hooks'
import { useActionMarkers } from './useActionMarkers'
import { useCurrentFeedItem } from './useCurrentFeedItem'

export function MapActions() {
  const dispatch = useDispatch()
  const { sendEvent } = useFirebase()

  const actionId = useActionId()
  const currentFeedItem = useCurrentFeedItem()
  const feedIsIdle = useSelector(selectFeedIsIdle)
  const feedFetching = useSelector(selectFeedIsFetching)

  useMount(() => {
    sendEvent('View__Feed')
    dispatch(feedActions.init())
    return () => {
      dispatch(feedActions.cancel())
    }
  })

  useEffect(() => {
    dispatch(feedActions.setCurrentFeedItemUuid(actionId || null))
  }, [actionId, dispatch])

  const { feedsMarkersContent, isLoading } = useActionMarkers()

  const cards = currentFeedItem ? <FeedItemCards key={actionId} /> : undefined

  const modalTexts = texts.content.map.actions.noActions.modal

  const onNoContentOnMap = useOnNoContentOnMap(
    feedFetching,
    !!currentFeedItem,
    <ModalNoContent text={modalTexts.text} title={modalTexts.title} />,
  )

  return (
    <>
      <MapContainer
        cards={cards}
        filters={<FeedFilters />}
        isLoading={isLoading}
        list={<FeedList />}
        markers={feedsMarkersContent}
        onNoContentOnMap={onNoContentOnMap}
      />
      <SplashScreen in={feedIsIdle} />
    </>

  )
}
