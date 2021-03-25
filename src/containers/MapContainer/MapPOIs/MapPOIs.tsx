import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { POIList } from '../LeftLists'
import { POIsFilters } from '../LeftLists/Filters'
import { POICards } from '../RightCards/POICards/POICards'
import { usePOIId } from '../usePOIId'
import { MapContainer } from 'src/containers/MapContainer'
import { poisActions, selectPOIDetailsIsFetching } from 'src/core/useCases/pois'
import { useFirebase, useMount } from 'src/utils/hooks'
import { useCurrentPOI } from './useCurrentPOI'
import { usePOIMarkers } from './usePOIMarkers'

export function MapPOIs() {
  const poiId = usePOIId()
  const currentPOI = useCurrentPOI()
  const poiDetailsFetching = useSelector(selectPOIDetailsIsFetching)
  const dispatch = useDispatch()
  const { sendEvent } = useFirebase()

  const { poisMarkersContent, isLoading } = usePOIMarkers()

  const cards = (poiDetailsFetching || currentPOI) ? <POICards key={poiId} /> : undefined

  useMount(() => {
    sendEvent('View__POIs')
    dispatch(poisActions.init())
    return () => {
      dispatch(poisActions.cancel())
    }
  })

  useEffect(() => {
    dispatch(poisActions.setCurrentPOIUuid(poiId || null))
  }, [poiId, dispatch])

  return (
    <MapContainer
      cards={cards}
      filters={<POIsFilters />}
      isLoading={isLoading}
      list={<POIList />}
      markers={poisMarkersContent}
    />
  )
}
