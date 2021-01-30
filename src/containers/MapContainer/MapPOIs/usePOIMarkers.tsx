import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { usePOIId } from '../usePOIId'
import { usePOIs } from '../usePOIs'
import { POIMarker, MarkerWrapper } from 'src/components/Map'
import { selectPOIsIsFetching } from 'src/core/useCases/pois'
import { useDelayLoadingNext } from 'src/utils/hooks'

export function usePOIMarkers() {
  const poiId = usePOIId()
  const pois = usePOIs()
  const poisFetching = useSelector(selectPOIsIsFetching)
  const isLoading = useDelayLoadingNext(poisFetching)
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
          <a>
            <POIMarker
              category={categoryId}
              isActive={uuid === poiId}
              tooltip={poi.name}
            />
          </a>
        </Link>
      </MarkerWrapper>
    )
  })

  return { poisMarkersContent, isLoading }
}
