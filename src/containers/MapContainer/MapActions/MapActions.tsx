import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FeedList } from '../LeftLists'
import { FeedFilters } from '../LeftLists/Filters'
import { FeedItemCards } from '../RightCards/FeedItemCards'
import { useActionId } from '../useActionId'
import { MapContainer } from 'src/containers/MapContainer'

import { feedActions } from 'src/core/useCases/feed'
import { useFirebase, useMount } from 'src/utils/hooks'
import { useActionMarkers } from './useActionMarkers'
import { useCurrentFeedItem } from './useCurrentFeedItem'

export function MapActions() {
  const dispatch = useDispatch()
  const actionId = useActionId()
  const { sendEvent } = useFirebase()
  const currentFeedItem = useCurrentFeedItem()

  useMount(() => {
    sendEvent('View__Feed')
    dispatch(feedActions.init())
    return () => {
      dispatch(feedActions.cancel())
    }
  })

  useEffect(() => {
    dispatch(feedActions.setCurrentItemUuid(actionId || null))
  }, [actionId, dispatch])

  const { feedsMarkersContent, isLoading } = useActionMarkers()

  const cards = currentFeedItem ? <FeedItemCards key={actionId} /> : undefined

  return (
    <MapContainer
      cards={cards}
      filters={<FeedFilters />}
      isLoading={isLoading}
      list={<FeedList />}
      markers={feedsMarkersContent}
    />
  )
}
