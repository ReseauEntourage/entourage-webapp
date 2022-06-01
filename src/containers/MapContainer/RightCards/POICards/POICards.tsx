import React from 'react'
import { useSelector } from 'react-redux'
import { RightCard } from '../RightCard'
import { POICard } from 'src/components/RightCards'
import { useCurrentPOI } from 'src/containers/MapContainer'
import { MetaData } from 'src/containers/MetaData'
import { env } from 'src/core/env'
import { selectPOIDetailsIsFetching } from 'src/core/useCases/pois'
import { texts } from 'src/i18n'
import { useDelayLoadingNext } from 'src/utils/hooks'
import { assertIsDefined } from 'src/utils/misc'

export function POICards() {
  const poi = useCurrentPOI()
  const poiDetailsFetching = useSelector(selectPOIDetailsIsFetching)
  const isLoading = useDelayLoadingNext(poiDetailsFetching)

  if (!poiDetailsFetching) {
    assertIsDefined(poi)

    const { name, uuid, description } = poi
    return (
      <>
        <MetaData
          description={description || texts.content.map.pois.shareDescription}
          title={name}
          url={`${env.SERVER_URL}/pois/${uuid}`}
        />
        <RightCard
          card={<POICard {...poi} />}
          href="/pois"
          isLoading={isLoading}
        />
      </>
    )
  }

  return (
    <RightCard
      href="/pois"
      isLoading={isLoading}
    />
  )
}
