import Link from 'next/link'
import React from 'react'
import { useActionId } from '../useActionId'
import { useNextFeed } from '../useNextFeed'
import { EventMarker, MarkerWrapper } from 'src/components/Map'

export function useActionMarkers() {
  const actionId = useActionId()
  const { feeds, isLoading } = useNextFeed()

  const feedsMarkersContent = feeds.map((feed) => {
    const { location, uuid } = feed
    return (
      <MarkerWrapper
        key={uuid}
        lat={location.latitude}
        lng={location.longitude}
      >
        <Link
          as={`/actions/${uuid}`}
          href="/actions/[actionId]"
        >
          <a>
            <EventMarker
              key={uuid}
              isActive={uuid === actionId}
              tooltip={feed.title}
            />
          </a>
        </Link>
      </MarkerWrapper>
    )
  })

  return { feedsMarkersContent, isLoading }
}
