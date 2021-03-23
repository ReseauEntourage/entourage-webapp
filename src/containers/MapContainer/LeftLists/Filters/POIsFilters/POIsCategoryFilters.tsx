import React from 'react'
import * as S from '../Filters.styles'
import { texts } from 'src/i18n'
import { FilterPOICategory } from 'src/utils/types'
import { POIsCategoryFilter } from './POIsCategoryFilter'

export function POIsCategoryFilters() {
  return (
    <S.SectionContainer>
      <S.Title align="center">{texts.content.map.filters.categories.title}</S.Title>
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
          FilterPOICategory.DONATION_BOX,
          FilterPOICategory.CLOAKROOM,
        ].map((category, i) => (
          <POIsCategoryFilter
            key={category}
            category={category}
            index={i + 1}
          />
        ))
      }
    </S.SectionContainer>
  )
}
