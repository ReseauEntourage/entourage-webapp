import { Link as MaterialLink } from '@material-ui/core'
import Link from 'next/link'
import React from 'react'
import { useActionId } from '../useActionId'
import { useNextFeed } from '../useNextFeed'
import { EventMarker, MarkerWrapper, ActionMarker } from 'src/components/Map'
import { useFirebase } from 'src/utils/hooks'

export function useActionMarkers() {
  const actionId = useActionId()
  const { feeds, isLoading } = useNextFeed()
  const { sendEvent } = useFirebase()

  const feedsMarkersContent = feeds.map((feed) => {
    const { location, uuid, groupType } = feed
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
          <MaterialLink
            onClick={() => sendEvent('Action__Feed__MapItem')}
            style={{
              textDecoration: 'none',
            }}
          >
            {
              groupType === 'outing'
                ? (
                  <EventMarker
                    key={uuid}
                    isActive={uuid === actionId}
                    tooltip={feed.title}
                  />
                )
                : (
                  <ActionMarker
                    key={uuid}
                    isActive={uuid === actionId}
                    tooltip={feed.title}
                  />
                )
            }

          </MaterialLink>
        </Link>
      </MarkerWrapper>
    )
  })

  return { feedsMarkersContent, isLoading }
}
