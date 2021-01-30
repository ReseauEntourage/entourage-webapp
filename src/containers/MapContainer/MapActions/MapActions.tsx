import React from 'react'
import { useDispatch } from 'react-redux'
import { FeedList } from '../LeftLists/FeedList'
import { FeedItemCards } from '../RightCards/FeedItemCards'
import { useActionId } from '../useActionId'
import { MapContainer } from 'src/containers/MapContainer'
import { feedActions } from 'src/core/useCases/feed'
import { useMount } from 'src/utils/hooks'
import { useActionMarkers } from './useActionMarkers'
import { useCurrentFeedItem } from './useCurrentFeedItem'

export function MapActions() {
  const dispatch = useDispatch()
  const actionId = useActionId()
  const currentFeedItem = useCurrentFeedItem()

  const { feedsMarkersContent, isLoading } = useActionMarkers()

  useMount(() => {
    dispatch(feedActions.init())
    dispatch(feedActions.retrieveFeed())
    return () => {
      dispatch(feedActions.cancel())
    }
  })

  const cards = currentFeedItem ? <FeedItemCards key={actionId} /> : undefined

  return (
    <MapContainer
      cards={cards}
      isLoading={isLoading}
      list={<FeedList />}
      markers={feedsMarkersContent}
    />
  )
}
