import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { POIList } from '../LeftLists/POIList'
import { POICards } from '../RightCards/POICards/POICards'
import { usePOIId } from '../usePOIId'
import { MapContainer } from 'src/containers/MapContainer'
import { poisActions, selectPOIDetailsIsFetching } from 'src/core/useCases/pois'
import { useMount } from 'src/utils/hooks'
import { useCurrentPOI } from './useCurrentPOI'
import { usePOIMarkers } from './usePOIMarkers'

export function MapPOIs() {
  const dispatch = useDispatch()
  const poiId = usePOIId()
  const currentPOI = useCurrentPOI()
  const poiDetailsFetching = useSelector(selectPOIDetailsIsFetching)

  const { poisMarkersContent, isLoading } = usePOIMarkers()

  useMount(() => {
    return () => {
      dispatch(poisActions.cancel())
    }
  })

  const cards = (poiDetailsFetching || currentPOI) ? <POICards key={poiId} /> : undefined

  return (
    <MapContainer
      cards={cards}
      isLoading={isLoading}
      list={<POIList />}
      markers={poisMarkersContent}
    />
  )
}
