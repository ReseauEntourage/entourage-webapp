import Link from 'next/link'
import React from 'react'
import * as S from '../LeftList.styles'
import { NoContent } from '../NoContent'
import { Link as CustomLink } from 'src/components/Link'
import { POIIcon } from 'src/components/Map'
import { POI } from 'src/components/POI'
import { usePOIId, usePOIs } from 'src/containers/MapContainer'
import { texts } from 'src/i18n'
import { useFirebase, useGetDistanceFromPosition } from 'src/utils/hooks'

export function POIList() {
  const poiId = usePOIId()
  const pois = usePOIs()
  const { sendEvent } = useFirebase()
  const getDistanceFromPosition = useGetDistanceFromPosition()

  const poiListContent = pois.map((poi) => {
    const distance = getDistanceFromPosition({ latitude: poi.latitude, longitude: poi.longitude })

    return (
      <S.ListItem key={poi.uuid}>
        <Link as={`/pois/${poi.uuid}`} href="/pois/[poiId]" passHref={true}>
          <CustomLink
            component="button"
            disableHover={true}
            onClick={() => sendEvent('Action__POIs__ListItem')}
            style={{ width: '100%' }}
          >
            <POI
              key={poi.uuid}
              address={poi.address}
              distance={distance ?? undefined}
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
      {
        pois.length > 0 ? (
          <ul>
            {poiListContent}
          </ul>
        ) : <NoContent text={texts.content.map.pois.noPOIs.list} />
      }

    </S.Scroll>
  )
}
