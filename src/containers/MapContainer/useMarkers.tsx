import Link from 'next/link'
import React from 'react'
import { EventMarker, /* POIMarker, */ MarkerWrapper } from 'src/components/Map'
// import { useQueryPOIs } from 'src/core/store'
import { useActionId } from './useActionId'
import { useFeeds } from './useFeeds'

export function useMarkers() {
  const actionId = useActionId()
  // const [POIs] = useQueryPOIs()
  const { feeds, isLoading } = useFeeds()

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
            />
          </a>
        </Link>
      </MarkerWrapper>
    )
  })

  // POI marker temporary disabled
  // TODO: https://entourage-asso.atlassian.net/browse/EN-2322

  // const POIsMarkersContent = POIs && POIs.data.pois.map((poi) => (
  //   <MarkerWrapper
  //     key={poi.id}
  //     lat={poi.latitude}
  //     lng={poi.longitude}
  //   >
  //     <POIMarker
  //       category={poi.category}
  //     />
  //   </MarkerWrapper>
  // ))

  const POIsMarkersContent = null

  return { feedsMarkersContent, POIsMarkersContent, isLoading }
}
