import Switch from '@material-ui/core/Switch'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsActiveFilter, feedActions } from 'src/core/useCases/feed'
import { AppState } from 'src/core/useCases/reducers'
import { texts } from 'src/i18n'
import { FilterEntourageType, FilterFeedCategory } from 'src/utils/types'
import { mapCategoriesToIcons } from './helper'
import * as S from './styles'

export interface LineFilterProps {
  index: number;
  type: FilterEntourageType;
  category: FilterFeedCategory;
}

export function LineFilter(props: LineFilterProps) {
  const { index, type, category } = props
  const CategoryIcon = mapCategoriesToIcons[category]

  const dispatch = useDispatch()

  const checked = useSelector<AppState, boolean>((state) => selectIsActiveFilter(state, type, category))
  const onChange = useCallback(() => {
    dispatch(feedActions.toggleFeedFilter({ type, category }))
  }, [dispatch, type, category])

  const label = texts.content.map.filters[type].category[category]

  return (
    <>
      <S.Icon index={index}><CategoryIcon color="primary" /></S.Icon>
      <S.Label index={index}>{label}</S.Label>
      <S.Switch index={index}><Switch checked={checked} color="primary" onChange={onChange} /></S.Switch>
    </>
  )
}
