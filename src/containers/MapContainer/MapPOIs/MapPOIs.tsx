import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { POIList } from '../LeftLists'
import { POIFilters } from '../LeftLists/Filters'
import { POICards } from '../RightCards/POICards/POICards'
import { useOnNoContentOnMap } from '../useOnNoContentOnMap'
import { usePOIId } from '../usePOIId'
import { SplashScreen } from 'src/components/SplashScreen'
import { constants } from 'src/constants'
import { MapContainer } from 'src/containers/MapContainer'
import { ModalNoContent } from 'src/containers/ModalNoContent'
import { env } from 'src/core/env'
import { poisActions, selectPOIDetailsIsFetching, selectPOIsIsFetching, selectPOIsIsIdle } from 'src/core/useCases/pois'
import { useMe } from 'src/hooks/useMe'
import { texts } from 'src/i18n'
import { useFirebase, useMount } from 'src/utils/hooks'
import { useCurrentPOI } from './useCurrentPOI'
import { usePOIMarkers } from './usePOIMarkers'

export function MapPOIs() {
  const dispatch = useDispatch()
  const { sendEvent } = useFirebase()

  const me = useMe()
  const poiId = usePOIId()
  const currentPOI = useCurrentPOI()
  const poiDetailsFetching = useSelector(selectPOIDetailsIsFetching)
  const poisIsIdle = useSelector(selectPOIsIsIdle)
  const { poisMarkersContent, isLoading } = usePOIMarkers()
  const poisFetching = useSelector(selectPOIsIsFetching)

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

  const modalTexts = texts.content.map.pois.noPOIs.modal

  const onNoContentOnMap = useOnNoContentOnMap(poisFetching, !!currentPOI, <ModalNoContent
    action={`${env.API_V1_URL}${constants.POI_FORM_LINK}${me?.token}`}
    actionButton={modalTexts.addButton}
    actionText={modalTexts.addText}
    restText={modalTexts.restText}
    text={modalTexts.text}
    title={modalTexts.title}
  />)

  return (
    <>
      <MapContainer
        cards={cards}
        filters={<POIFilters />}
        isLoading={isLoading}
        list={<POIList />}
        markers={poisMarkersContent}
        onNoContentOnMap={onNoContentOnMap}
      />
      <SplashScreen in={poisIsIdle} />
    </>
  )
}
