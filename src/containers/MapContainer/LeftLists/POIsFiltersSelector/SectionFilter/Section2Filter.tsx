import React from 'react'
import { texts } from 'src/i18n'
import { FilterPOICategory } from 'src/utils/types'
import * as S from './Filter.styles'
import { LineFilter } from './LineFilter'

export function Section2Filter() {
  return (
    <S.SectionContainer>
      <S.Title align="center">{texts.content.map.filters.categories.title}</S.Title>
      {
        Object.values(FilterPOICategory)
          .filter((value) => value !== FilterPOICategory.PARTNERS)
          .map((category, i) => (
            <LineFilter
              key={category}
              category={category}
              index={i + 1}
            />
          ))
      }
    </S.SectionContainer>
  )
}
