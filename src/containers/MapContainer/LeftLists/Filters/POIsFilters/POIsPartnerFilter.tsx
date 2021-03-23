import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LineFilter } from '../LineFilter'
import { poisActions, selectIsActiveFilter } from 'src/core/useCases/pois'

import { AppState } from 'src/core/useCases/reducers'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'
import { FilterPOICategory, FilterPOIPartner } from 'src/utils/types'

interface TextFilterProps {
  index: number;
  category: typeof FilterPOICategory.PARTNERS;
  partner: FilterPOIPartner;
}

export function POIsPartnerFilter(props: TextFilterProps) {
  const { index, category, partner } = props
  const dispatch = useDispatch()

  const checked = useSelector<AppState, boolean>((state) => selectIsActiveFilter(state, category, partner))

  const onChange = useCallback(() => {
    dispatch(poisActions.togglePOIsFilter({ category, partner }))
  },
  [category, dispatch, partner])

  const label = texts.types.pois[partner]

  return (
    <LineFilter
      checked={checked}
      index={index}
      label={label}
      onChange={onChange}
      variant={variants.bodyRegular}
    />
  )
}
