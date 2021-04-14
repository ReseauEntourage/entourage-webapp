import React from 'react'
import * as S from '../Filters.styles'
import { texts } from 'src/i18n'
import { FilterPOICategory } from 'src/utils/types'
import { POICategoryFilter } from './POICategoryFilter'

export function POICategoryFilters() {
  return (
    <S.SectionContainer>
      <S.SectionTitle align="center">{texts.content.map.filters.categories.title}</S.SectionTitle>
      {
        [
          FilterPOICategory.EATING,
          FilterPOICategory.SLEEPING,
          FilterPOICategory.HEALING,
          FilterPOICategory.ORIENTATION,
          FilterPOICategory.REINTEGRATION,
          FilterPOICategory.TOILETS,
          FilterPOICategory.FOUNTAINS,
          FilterPOICategory.SHOWERS,
          FilterPOICategory.LAUNDRIES,
          FilterPOICategory.WELL_BEING,
          FilterPOICategory.CLOTHES,
          FilterPOICategory.CLOAKROOM,
          FilterPOICategory.DONATION_BOX,
        ].map((category, i) => (
          <POICategoryFilter
            key={category}
            category={category}
            index={i + 1}
          />
        ))
      }
    </S.SectionContainer>
  )
}
