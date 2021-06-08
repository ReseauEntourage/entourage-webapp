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
import { useLoadGoogleMapApi } from 'src/utils/misc'
import { useActionMarkers } from './useActionMarkers'
import { useCurrentFeedItem } from './useCurrentFeedItem'

export function MapActions() {
  const dispatch = useDispatch()
  const actionId = useActionId()
  const { sendEvent } = useFirebase()
  const currentFeedItem = useCurrentFeedItem()
  const feedIsIdle = useSelector(selectFeedIsIdle)

  const googleMapApiIsLoaded = useLoadGoogleMapApi()

  const { feedsMarkersContent, isLoading } = useActionMarkers()

  const cards = currentFeedItem ? <FeedItemCards key={actionId} /> : undefined

  useMount(() => {
    sendEvent('View__Feed')
    return () => {
      dispatch(feedActions.cancel())
    }
  })

  useEffect(() => {
    if (googleMapApiIsLoaded) {
      const hasNotLoadedFromSSR = !actionId
      if (hasNotLoadedFromSSR) {
        dispatch(feedActions.init())
        dispatch(feedActions.setCurrentFeedItemUuid(actionId || null))
      }
    }
  }, [actionId, dispatch, googleMapApiIsLoaded])

  if (!googleMapApiIsLoaded) {
    return <SplashScreen />
  }

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
