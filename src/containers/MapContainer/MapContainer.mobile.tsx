import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Map } from 'src/components/Map'
import { selectMapHasMoved } from 'src/core/useCases/location'
import { useRefreshData } from 'src/hooks/useRefreshData'
import { texts } from 'src/i18n'
import { LeftList } from './LeftLists'
import * as S from './MapContainer.styles'
import { MapContainerProps } from './index'

export function MapContainerMobile(props: MapContainerProps) {
  const { markers, cards, list, isLoading, filters } = props

  const [isMapOpen, setIsMapOpen] = useState<boolean>(false)

  const mapHasMoved = useSelector(selectMapHasMoved)
  const refreshData = useRefreshData()

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
          <S.FabMap color="primary" onClick={() => setIsMapOpen(false)} size="small" variant="extended">
            <ChevronLeftIcon />
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
