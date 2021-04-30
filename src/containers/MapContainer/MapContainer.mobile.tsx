import React, { useState } from 'react'
import { Map } from 'src/components/Map'
import { texts } from 'src/i18n'
import { LeftList } from './LeftLists'
import * as S from './MapContainer.styles'
import { MapContainerProps } from './index'

export function MapContainerMobile(props: MapContainerProps) {
  const { markers, cards, list, isLoading, filters } = props

  const [isMapOpen, setIsMapOpen] = useState<boolean>(false)

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
          <S.FabMap color="primary" onClick={() => setIsMapOpen(false)} size="small" variant="extended">
            <S.ReturnIcon />
            {texts.content.navActions.returnButton}
          </S.FabMap>
        </S.MapContainer>
      ) : (
        <>
          <LeftList filters={filters} isLoading={isLoading} list={list} />
          <S.FabFeed color="primary" onClick={() => setIsMapOpen(true)} size="small" variant="extended">
            <S.NavIcon />
            {texts.content.navActions.mapButton}
          </S.FabFeed>
        </>
      ) }

    </S.Container>
  )
}
