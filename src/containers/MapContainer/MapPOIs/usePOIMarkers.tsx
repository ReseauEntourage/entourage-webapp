import { Link as MaterialLink } from '@material-ui/core'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { usePOIId } from '../usePOIId'
import { usePOIs } from '../usePOIs'
import { POIMarker, MarkerWrapper } from 'src/components/Map'
import { selectPOIsIsFetching } from 'src/core/useCases/pois'
import { useDelayLoadingNext, useFirebase } from 'src/utils/hooks'

export function usePOIMarkers() {
  const poiId = usePOIId()
  const pois = usePOIs()
  const poisFetching = useSelector(selectPOIsIsFetching)
  const isLoading = useDelayLoadingNext(poisFetching)
  const { sendEvent } = useFirebase()

  const poisMarkersContent = pois && pois.map((poi) => {
    const { categoryId, latitude, longitude, uuid } = poi
    return (
      <MarkerWrapper
        key={uuid}
        lat={latitude}
        lng={longitude}
      >
        <Link
          as={`/pois/${uuid}`}
          href="/pois/[poiId]"
        >
          <MaterialLink
            onClick={() => sendEvent('Action__POIs__MapItem')}
            style={{
              textDecoration: 'none',
            }}
          >
            <POIMarker
              category={categoryId}
              isActive={uuid === poiId}
              tooltip={poi.name}
            />
          </MaterialLink>
        </Link>
      </MarkerWrapper>
    )
  })

  return { poisMarkersContent, isLoading }
}
