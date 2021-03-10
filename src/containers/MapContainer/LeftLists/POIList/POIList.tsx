import Link from 'next/link'
import React from 'react'
import * as S from '../LeftList.styles'
import { POIIcon } from 'src/components/Map'
import { POI } from 'src/components/POI'
import { usePOIId, usePOIs } from 'src/containers/MapContainer'
import { useFirebase } from 'src/utils/hooks'

export function POIList() {
  const poiId = usePOIId()
  const pois = usePOIs()
  const { sendEvent } = useFirebase()

  const poiListContent = pois.map((poi) => {
    return (
      <S.ListItem key={poi.uuid}>
        <Link as={`/pois/${poi.uuid}`} href="/pois/[poiId]">
          <S.ClickableItem onClick={() => sendEvent('Action__POIs__ListItem')}>
            <POI
              key={poi.uuid}
              address={poi.address}
              icon={<POIIcon poiCategory={poi.categoryId} />}
              isActive={poi.uuid === poiId}
              name={poi.name}
              phone={poi.phone}
            />
          </S.ClickableItem>
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
