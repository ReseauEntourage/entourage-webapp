import React, { useEffect } from 'react'
import { Map, RefreshButton } from 'src/components/Map'
import { LeftList } from './LeftLists'
import * as S from './MapContainer.styles'
import { MapContainerProps } from './index'

export function MapContainerDesktop(props: MapContainerProps) {
  const { markers, cards, list, isLoading, filters, onNoContentOnMap } = props

  useEffect(() => {
    if (markers.length === 0) {
      onNoContentOnMap()
    }
  }, [markers, onNoContentOnMap])

  return (
    <S.Container>
      <LeftList filters={filters} isLoading={isLoading} list={list} />
      <S.MapContainer>
        <Map>
          {markers}
        </Map>
        <RefreshButton />
      </S.MapContainer>
      {
        cards && (
          <S.RightCardsContainer boxShadow={4}>
            {cards}
          </S.RightCardsContainer>
        )
      }
    </S.Container>
  )
}
