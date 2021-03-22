import Switch from '@material-ui/core/Switch'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsActiveFilter, poisActions } from 'src/core/useCases/pois'

import { AppState } from 'src/core/useCases/reducers'
import { texts } from 'src/i18n'
import { colors, variants } from 'src/styles'
import {
  poiIcons,
  poiLabels,
  poisCategoriesFilterResolver,
} from 'src/utils/misc'
import { FilterPOICategory } from 'src/utils/types'
import * as S from './Filter.styles'

export interface LineFilterProps {
  index: number;
  category: FilterPOICategory;
  title?: boolean;
}

export function LineFilter(props: LineFilterProps) {
  const { index, category, title = false } = props
  const categoryId = poisCategoriesFilterResolver[category]
  const CategoryIcon = poiIcons[categoryId] || poiIcons[0]

  const dispatch = useDispatch()

  const checked = useSelector<AppState, boolean>((state) => selectIsActiveFilter(state, category))
  const onChange = useCallback(() => {
    dispatch(poisActions.togglePOIsFilter({ category }))
  }, [dispatch, category])

  const label = category === FilterPOICategory.PARTNERS
    ? texts.content.map.filters[category].title : poiLabels[categoryId]
  const color = colors.pois[categoryId] ?? colors.pois[0]

  return (
    <>
      <S.Icon color={color} index={index}><CategoryIcon /></S.Icon>
      <S.Label index={index} variant={title ? variants.title2 : variants.bodyRegular}>{label}</S.Label>
      <S.Switch index={index}><Switch checked={checked} color="primary" onChange={onChange} /></S.Switch>
    </>
  )
}
