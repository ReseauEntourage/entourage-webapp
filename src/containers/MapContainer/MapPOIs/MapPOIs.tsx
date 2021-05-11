import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { POIList } from '../LeftLists'
import { POIFilters } from '../LeftLists/Filters'
import { POICards } from '../RightCards/POICards/POICards'
import { usePOIId } from '../usePOIId'
import { SplashScreen } from 'src/components/SplashScreen'
import { MapContainer } from 'src/containers/MapContainer'
import { poisActions, selectPOIDetailsIsFetching, selectPOIsIsIdle } from 'src/core/useCases/pois'
import { useFirebase, useMount } from 'src/utils/hooks'
import { useCurrentPOI } from './useCurrentPOI'
import { usePOIMarkers } from './usePOIMarkers'

export function MapPOIs() {
  const poiId = usePOIId()
  const currentPOI = useCurrentPOI()
  const poiDetailsFetching = useSelector(selectPOIDetailsIsFetching)
  const dispatch = useDispatch()
  const { sendEvent } = useFirebase()
  const poisIsIdle = useSelector(selectPOIsIsIdle)

  const { poisMarkersContent, isLoading } = usePOIMarkers()

  const cards = (poiDetailsFetching || currentPOI) ? <POICards key={poiId} /> : undefined

  useMount(() => {
    sendEvent('View__POIs')
    return () => {
      dispatch(poisActions.cancel())
    }
  })

  return (
    <>
      <MapContainer
        cards={cards}
        filters={<POIFilters />}
        isLoading={isLoading}
        list={<POIList />}
        markers={poisMarkersContent}
      />
      <SplashScreen in={poisIsIdle} />
    </>
  )
}
