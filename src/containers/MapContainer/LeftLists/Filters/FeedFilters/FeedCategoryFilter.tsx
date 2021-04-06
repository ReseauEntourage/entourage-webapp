import { SvgIconProps } from '@material-ui/core/SvgIcon'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LineFilter } from '../LineFilter'
import { FeedItemIcon } from 'src/components/Map'
import { selectIsActiveActionTypesFilter, feedActions } from 'src/core/useCases/feed'
import { AppState } from 'src/core/useCases/reducers'
import { texts } from 'src/i18n'
import { FilterEntourageType, FilterFeedCategory } from 'src/utils/types'

export interface FeedCategoryFilterProps {
  index: number;
  type: FilterEntourageType;
  category: FilterFeedCategory;
  color: string;
}

export function FeedCategoryFilter(props: FeedCategoryFilterProps) {
  const { index, type, category, color } = props

  const categoryTextKey = type === FilterEntourageType.CONTRIBUTION ? 'categoryContributionList' : 'categoryHelpList'
  const label = texts.types[categoryTextKey][category]

  const CategoryIcon = (iconProps: SvgIconProps) => (
    <FeedItemIcon
      displayCategory={category}
      entourageType={type}
      tooltip={label}
      {...iconProps}
    />
  )

  const dispatch = useDispatch()

  const checked = useSelector<AppState, boolean>((state) => selectIsActiveActionTypesFilter(state, type, category))
  const onChange = useCallback(() => {
    dispatch(feedActions.toggleActionTypesFilter({ type, category }))
  }, [dispatch, type, category])

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
