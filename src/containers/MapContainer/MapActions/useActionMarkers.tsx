import { Link as MaterialLink } from '@material-ui/core'
import Link from 'next/link'
import React from 'react'
import { useActionId } from '../useActionId'
import { useNextFeed } from '../useNextFeed'
import { EventMarker, MarkerWrapper, ActionMarker } from 'src/components/Map'
import { useFirebase } from 'src/utils/hooks'
import { assertCondition } from 'src/utils/misc'

export function useActionMarkers() {
  const actionId = useActionId()
  const { feeds, isLoading } = useNextFeed()
  const { sendEvent } = useFirebase()

  const feedsMarkersContent = feeds
    .filter((feedItem) => feedItem.itemType === 'Entourage')
    .map((feedItem) => {
      assertCondition(feedItem.itemType === 'Entourage')

      const { location, uuid, groupType } = feedItem
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
                      tooltip={feedItem.title}
                    />
                  )
                  : (
                    <ActionMarker
                      key={uuid}
                      isActive={uuid === actionId}
                      tooltip={feedItem.title}
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
