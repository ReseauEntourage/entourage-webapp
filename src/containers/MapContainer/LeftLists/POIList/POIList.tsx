import Link from 'next/link'
import React from 'react'
import * as S from '../LeftList.styles'
import { POIIcon } from 'src/components/Map'
import { POI } from 'src/components/POI'
import { usePOIId, usePOIs } from 'src/containers/MapContainer'

export function POIList() {
  const poiId = usePOIId()
  const pois = usePOIs()

  const poiListContent = pois.map((poi) => {
    return (
      <S.ListItem key={poi.uuid}>
        <Link as={`/pois/${poi.uuid}`} href="/pois/[poiId]">
          <div style={{ cursor: 'pointer' }}>
            <POI
              key={poi.uuid}
              address={poi.address}
              icon={<POIIcon poiCategory={poi.categoryId} />}
              isActive={poi.uuid === poiId}
              name={poi.name}
              phone={poi.phone}
            />
          </div>
        </Link>
      </S.ListItem>
    )
  })

  return (
    <S.Scroll>
      <ul>
        {poiListContent}
      </ul>
    </S.Scroll>
  )
}
