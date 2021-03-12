import React from 'react'
import { FilterEntourageType, FilterFeedCategory } from 'src/utils/types'
import { HeadFilter } from './HeadFilter'
import { LineFilter } from './LineFilter'
import * as S from './styles'

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
      />
      <LineFilter
        category={FilterFeedCategory.SOCIAL}
        index={1}
        type={type}
      />
      <LineFilter
        category={FilterFeedCategory.MAT_HELP}
        index={2}
        type={type}
      />
      <LineFilter
        category={FilterFeedCategory.RESOURCE}
        index={3}
        type={type}
      />
      <LineFilter
        category={FilterFeedCategory.OTHER}
        index={4}
        type={type}
      />
    </S.SectionContainer>
  )
}
