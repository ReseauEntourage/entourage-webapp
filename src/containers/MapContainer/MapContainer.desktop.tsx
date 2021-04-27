import React from 'react'
import { useSelector } from 'react-redux'
import { Map } from 'src/components/Map'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { selectMapHasMoved } from 'src/core/useCases/location'
import { useRefreshData } from 'src/hooks/useRefreshData'
import { texts } from 'src/i18n'
import { LeftList } from './LeftLists'
import * as S from './MapContainer.styles'
import { MapContainerProps } from './index'

export function MapContainerDesktop(props: MapContainerProps) {
  const { markers, cards, list, isLoading, filters } = props
  const mapHasMoved = useSelector(selectMapHasMoved)
  const refreshData = useRefreshData()

  return (
    <S.Container>
      <LeftList filters={filters} isLoading={isLoading} list={list} />
      <S.MapContainer>
        <Map>
          {markers}
        </Map>
        {
          mapHasMoved
          && (
            <S.FabContainer>
              <S.FabRefresh
                color="primary"
                onClick={refreshData}
                size="small"
                variant="extended"
              >
                <S.RefreshIcon />
                {texts.content.navActions.refresh}
              </S.FabRefresh>
            </S.FabContainer>
          )
        }
        {isLoading && <OverlayLoader />}
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
