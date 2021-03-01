import React from 'react'
import { FeedList } from '../LeftLists/FeedList'
import { FeedItemCards } from '../RightCards/FeedItemCards'
import { useActionId } from '../useActionId'
import { MapContainer } from 'src/containers/MapContainer'
import { useActionMarkers } from './useActionMarkers'
import { useCurrentFeedItem } from './useCurrentFeedItem'

export function MapActions() {
  const actionId = useActionId()
  const currentFeedItem = useCurrentFeedItem()

  const { feedsMarkersContent, isLoading } = useActionMarkers()

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
