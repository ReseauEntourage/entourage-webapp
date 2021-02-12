import React from 'react'
import { useSelector } from 'react-redux'
import { useCurrentPOI } from '../../MapPOIs'
import { RightCard } from '../RightCard'
import { POICard } from 'src/components/RightCards'
import { selectPOIDetailsIsFetching } from 'src/core/useCases/pois'
import { useDelayLoadingNext } from 'src/utils/hooks'
import { assertIsDefined } from 'src/utils/misc'

export function POICards() {
  const poi = useCurrentPOI()
  const poiDetailsFetching = useSelector(selectPOIDetailsIsFetching)
  const isLoading = useDelayLoadingNext(poiDetailsFetching)

  if (!poiDetailsFetching) {
    assertIsDefined(poi)
    return (
      <RightCard
        card={<POICard {...poi} />}
        href="/pois"
        isLoading={isLoading}
      />
    )
  }

  return (
    <RightCard
      href="/pois"
      isLoading={isLoading}
    />
  )
}
