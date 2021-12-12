import { SvgIconProps } from '@material-ui/core/SvgIcon'
import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LineFilter } from '../LineFilter'
import { POIIcon } from 'src/components/Map'
import { selectIsActiveFilter, poisActions } from 'src/core/useCases/pois'

import { AppState } from 'src/core/useCases/reducers'
import { texts } from 'src/i18n'
import { colors, variants } from 'src/styles'
import {
  poiLabels,
  poisCategoriesFilterResolver,
} from 'src/utils/misc'
import { FilterPOICategory } from 'src/utils/types'

export interface POICategoryFilter {
  index?: number;
  category: FilterPOICategory;
  title?: boolean;
}

export function POICategoryFilter(props: POICategoryFilter) {
  const { index, category, title = false } = props
  const categoryId = poisCategoriesFilterResolver[category]
  const CategoryIcon = useMemo(() => {
    return (iconProps: SvgIconProps) => (
      <POIIcon poiCategory={categoryId} {...iconProps} />
    )
  }, [categoryId])

  const dispatch = useDispatch()

  const checked = useSelector<AppState, boolean>((state) => selectIsActiveFilter(state, category))
  const onChange = useCallback(() => {
    dispatch(poisActions.togglePOIsFilter({ category }))
  }, [dispatch, category])

  const label = category === FilterPOICategory.PARTNERS
    ? texts.content.map.filters[category].title : poiLabels[categoryId]
  const color = colors.pois[categoryId] ?? colors.pois[0]

  return (
    <LineFilter
      checked={checked}
      Icon={CategoryIcon}
      iconColor={color}
      index={index}
      label={label}
      onChange={onChange}
      variant={title ? variants.title2 : variants.bodyRegular}
    />
  )
}
