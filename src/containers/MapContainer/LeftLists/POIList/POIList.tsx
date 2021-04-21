import Link from 'next/link'
import React from 'react'
import * as S from '../LeftList.styles'
import { Link as CustomLink } from 'src/components/Link'
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
        <Link as={`/pois/${poi.uuid}`} href="/pois/[poiId]" passHref={true}>
          <CustomLink
            disableHover={true}
            onClick={() => sendEvent('Action__POIs__ListItem')}
            style={{ width: '100%' }}
          >
            <POI
              key={poi.uuid}
              address={poi.address}
              icon={<POIIcon poiCategory={poi.categoryId} />}
              isActive={poi.uuid === poiId}
              name={poi.name}
              phone={poi.phone}
            />
          </CustomLink>
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
