import React from 'react'
import { useSelector } from 'react-redux'
import { selectMapHasMoved } from 'src/core/useCases/location'
import { useRefreshData } from 'src/hooks/useRefreshData'
import { texts } from 'src/i18n'
import * as S from './RefreshButton.styles'

export function RefreshButton() {
  const mapHasMoved = useSelector(selectMapHasMoved)
  const refreshData = useRefreshData()

  if (mapHasMoved) {
    return (
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

  return null
}
