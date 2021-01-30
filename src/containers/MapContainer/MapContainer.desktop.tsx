import React from 'react'
import { Map } from 'src/components/Map'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { LeftList } from './LeftLists/LeftList'
import * as S from './MapContainer.styles'
import { MapContainerProps } from './index'

export function MapContainerDesktop(props: MapContainerProps) {
  const { markers, cards, list, isLoading } = props

  return (
    <S.Container>
      <LeftList isLoading={isLoading} list={list} />
      <S.MapContainer>
        <Map>
          {markers}
        </Map>
        {isLoading && <OverlayLoader />}
      </S.MapContainer>
      {
        (cards) && (
          <S.RightCardsContainer boxShadow={4}>
            {cards}
          </S.RightCardsContainer>
        )
      }
    </S.Container>
  )
}
