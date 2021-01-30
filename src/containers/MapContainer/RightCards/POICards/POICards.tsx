import React from 'react'
import { useSelector } from 'react-redux'
import { useCurrentPOI } from '../../MapPOIs/useCurrentPOI'
import { RightCard } from '../RightCard'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { POICard } from 'src/components/RightCards'
import { selectPOIDetailsIsFetching } from 'src/core/useCases/pois'
import { useDelayLoadingNext } from 'src/utils/hooks'
import { assertIsDefined } from 'src/utils/misc'

export function POICards() {
  const poi = useCurrentPOI()
  const poiDetailsFetching = useSelector(selectPOIDetailsIsFetching)
  const isLoading = useDelayLoadingNext(poiDetailsFetching)

  let card = isLoading ? <OverlayLoader /> : undefined

  if (!poiDetailsFetching) {
    assertIsDefined(poi)
    if (!poi) {
      return null
    }
    card = <POICard {...poi} />
  }

  return (
    <RightCard
      card={card}
      href="/pois"
    />
  )
}
