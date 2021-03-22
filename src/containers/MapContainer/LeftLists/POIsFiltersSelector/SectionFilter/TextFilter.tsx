import Switch from '@material-ui/core/Switch'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { poisActions, selectIsActiveFilter } from 'src/core/useCases/pois'

import { AppState } from 'src/core/useCases/reducers'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'
import { FilterPOICategory, FilterPOIPartner } from 'src/utils/types'
import * as S from './Filter.styles'

interface TextFilterProps {
  index: number;
  category: typeof FilterPOICategory.PARTNERS;
  partner: FilterPOIPartner;
}

export function TextFilter(props: TextFilterProps) {
  const { index, category, partner } = props
  const dispatch = useDispatch()

  const checked = useSelector<AppState, boolean>((state) => selectIsActiveFilter(state, category, partner))

  const onChange = useCallback(() => {
    dispatch(poisActions.togglePOIsFilter({ category, partner }))
  },
  [category, dispatch, partner])

  const label = texts.types.pois[partner]

  return (
    <>
      <S.Label index={index} variant={variants.bodyRegular}>{label}</S.Label>
      <S.Switch index={index}><Switch checked={checked} onChange={onChange} /></S.Switch>
    </>
  )
}
