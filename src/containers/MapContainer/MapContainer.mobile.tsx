import React, { useState } from 'react'
import { Map } from 'src/components/Map'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { texts } from 'src/i18n'
import { LeftList } from './LeftLists/LeftList'
import * as S from './MapContainer.styles'
import { MapContainerProps } from './index'

export function MapContainerMobile(props: MapContainerProps) {
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false)

  const { markers, cards, list, isLoading } = props

  if (cards) {
    return (
      <S.Container>
        {cards}
      </S.Container>
    )
  }

  return (
    <S.Container>
      { isMapOpen ? (
        <S.MapContainer>
          <Map>
            {markers}
          </Map>
          {isLoading && <OverlayLoader />}
          <S.FabMap color="primary" onClick={() => setIsMapOpen(false)} size="small" variant="extended">
            <S.ReturnIcon />
            {texts.content.navActions.returnButton}
          </S.FabMap>

        </S.MapContainer>
      ) : (
        <>
          <LeftList isLoading={isLoading} list={list} />
          <S.FabFeed color="primary" onClick={() => setIsMapOpen(true)} size="small" variant="extended">
            <S.NavIcon />
            {texts.content.navActions.mapButton}
          </S.FabFeed>
        </>
      ) }

    </S.Container>
  )
}
