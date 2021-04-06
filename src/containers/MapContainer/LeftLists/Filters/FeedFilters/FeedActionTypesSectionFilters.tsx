import React from 'react'
import * as S from '../Filters.styles'
import { FilterEntourageType, FilterFeedCategory } from 'src/utils/types'
import { FeedCategoryFilter } from './FeedCategoryFilter'
import { FeedTypeFilter } from './FeedTypeFilter'

interface SectionFilterProps {
  type: FilterEntourageType;
  color: string;
}

export function FeedActionTypesSectionFilters(props: SectionFilterProps) {
  const { type, color } = props
  return (
    <S.SectionContainer>
      <FeedTypeFilter
        index={0}
        type={type}
      /> {
        [
          FilterFeedCategory.SOCIAL,
          FilterFeedCategory.MAT_HELP,
          FilterFeedCategory.RESOURCE,
          FilterFeedCategory.OTHER,
        ].map((category, i) => (
          <FeedCategoryFilter
            key={category}
            category={category}
            color={color}
            index={i + 1}
            type={type}
          />
        ))
      }
    </S.SectionContainer>
  )
}
