import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LineFilter } from '../LineFilter'
import { selectIsActiveActionTypesFilter, feedActions } from 'src/core/useCases/feed'
import { AppState } from 'src/core/useCases/reducers'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'
import { FeedCategoryFilterProps } from './FeedCategoryFilter'

export function FeedTypeFilter(props: Omit<FeedCategoryFilterProps, 'color' | 'category'>) {
  const { index, type } = props
  const dispatch = useDispatch()

  const checked = useSelector<AppState, boolean>((state) => selectIsActiveActionTypesFilter(state, type))

  const onChange = useCallback(
    () => {
      dispatch(feedActions.toggleActionTypesFilter({ type }))
    },
    [dispatch, type],
  )

  const label = texts.content.map.filters[type].title

  return (
    <LineFilter
      checked={checked}
      index={index}
      label={label}
      onChange={onChange}
      variant={variants.title2}
    />
  )
}
