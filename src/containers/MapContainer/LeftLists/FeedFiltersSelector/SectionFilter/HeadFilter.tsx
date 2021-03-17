import Switch from '@material-ui/core/Switch'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsActiveFilter, feedActions } from 'src/core/useCases/feed'
import { AppState } from 'src/core/useCases/reducers'
import { texts } from 'src/i18n'
import { LineFilterProps } from './LineFilter'
import * as S from './styles'

export function HeadFilter(props: Omit<LineFilterProps, 'category'>) {
  const { index, type } = props
  const dispatch = useDispatch()

  const checked = useSelector<AppState, boolean>((state) => selectIsActiveFilter(state, type))

  const onChange = useCallback(() => {
    dispatch(feedActions.toggleFeedFilter({ type }))
  },
  [dispatch, type])

  const label = texts.content.map.filters[type].title

  return (
    <>
      <S.Title>{label}</S.Title>
      <S.Switch index={index}><Switch checked={checked} onChange={onChange} /></S.Switch>
    </>
  )
}
