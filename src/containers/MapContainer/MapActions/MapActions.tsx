import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeedList } from '../LeftLists'
import { FeedFilters } from '../LeftLists/Filters'
import { FeedItemCards } from '../RightCards/FeedItemCards'
import { useActionId } from '../useActionId'
import { SplashScreen } from 'src/components/SplashScreen'
import { MapContainer } from 'src/containers/MapContainer'

import { feedActions, selectFeedIsIdle } from 'src/core/useCases/feed'
import { useFirebase, useMount } from 'src/utils/hooks'
import { useActionMarkers } from './useActionMarkers'
import { useCurrentFeedItem } from './useCurrentFeedItem'

export function MapActions() {
  const dispatch = useDispatch()
  const actionId = useActionId()
  const { sendEvent } = useFirebase()
  const currentFeedItem = useCurrentFeedItem()
  const feedIsIdle = useSelector(selectFeedIsIdle)

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

  return (
    <>
      <MapContainer
        cards={cards}
        filters={<FeedFilters />}
        isLoading={isLoading}
        list={<FeedList />}
        markers={feedsMarkersContent}
      />
      <SplashScreen in={feedIsIdle} />
    </>

  )
}
