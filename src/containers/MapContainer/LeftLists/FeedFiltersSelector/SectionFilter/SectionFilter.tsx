import React from 'react'
import { FilterEntourageType, FilterFeedCategory } from 'src/utils/types'
import * as S from './Filter.styles'
import { HeadFilter } from './HeadFilter'
import { LineFilter } from './LineFilter'

interface SectionFilterProps {
  type: FilterEntourageType;
}

export function SectionFilter(props: SectionFilterProps) {
  const { type } = props
  return (
    <S.SectionContainer>
      <HeadFilter
        index={0}
        type={type}
      /> {
        [
          FilterFeedCategory.SOCIAL,
          FilterFeedCategory.MAT_HELP,
          FilterFeedCategory.RESOURCE,
          FilterFeedCategory.OTHER,
        ].map((category, i) => (
          <LineFilter
            category={category}
            index={i + 1}
            type={type}
          />
        ))
      }
    </S.SectionContainer>
  )
}
