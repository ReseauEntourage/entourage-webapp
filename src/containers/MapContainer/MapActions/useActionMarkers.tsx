import Link from 'next/link'
import React from 'react'
import { useActionId } from '../useActionId'
import { useNextFeed } from '../useNextFeed'
import { Link as CustomLink } from 'src/components/Link'
import { EventMarker, MarkerWrapper, ActionMarker } from 'src/components/Map'
import { useFirebase } from 'src/utils/hooks'
import { assertCondition } from 'src/utils/misc'

export function useActionMarkers() {
  const actionId = useActionId()
  const { feeds, isLoading } = useNextFeed()
  const { sendEvent } = useFirebase()

  const feedsMarkersContent = feeds
    .filter((feedItem) => feedItem.itemType === 'Entourage'
      && (feedItem.groupType === 'action' || (feedItem.groupType === 'outing' && !feedItem.online)))
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
            passHref={true}
          >
            <CustomLink
              disableHover={true}
              onClick={() => sendEvent('Action__Feed__MapItem')}
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

            </CustomLink>
          </Link>
        </MarkerWrapper>
      )
    })

  return { feedsMarkersContent, isLoading }
}
