import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LineFilter } from '../LineFilter'
import { selectIsActiveFilter, feedActions } from 'src/core/useCases/feed'
import { AppState } from 'src/core/useCases/reducers'
import { texts } from 'src/i18n'
import { feedItemCategoryIcons } from 'src/utils/misc'
import { FilterEntourageType, FilterFeedCategory } from 'src/utils/types'

export interface LineFilterProps {
  index: number;
  type: FilterEntourageType;
  category: FilterFeedCategory;
  color: string;
}

export function FeedCategoryFilter(props: LineFilterProps) {
  const { index, type, category, color } = props
  const CategoryIcon = feedItemCategoryIcons[category] || feedItemCategoryIcons.other

  const dispatch = useDispatch()

  const checked = useSelector<AppState, boolean>((state) => selectIsActiveFilter(state, type, category))
  const onChange = useCallback(() => {
    dispatch(feedActions.toggleFeedFilter({ type, category }))
  }, [dispatch, type, category])

  const categoryTextKey = type === FilterEntourageType.CONTRIBUTION ? 'categoryContributionList' : 'categoryHelpList'
  const label = texts.types[categoryTextKey][category]

  return (
    <LineFilter
      checked={checked}
      Icon={CategoryIcon}
      iconColor={color}
      index={index}
      label={label}
      onChange={onChange}
    />
  )
}
