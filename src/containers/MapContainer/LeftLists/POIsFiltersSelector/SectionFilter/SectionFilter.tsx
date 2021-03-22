import React from 'react'
import { FilterPOICategory, FilterPOIPartner } from 'src/utils/types'
import * as S from './Filter.styles'
import { LineFilter } from './LineFilter'
import { TextFilter } from './TextFilter'

interface SectionFilterProps {
  category: FilterPOICategory;
}

export function SectionFilter(props: SectionFilterProps) {
  const { category } = props
  return (
    <S.SectionContainer>
      <LineFilter category={category} index={0} title={true} />
      {
        [
          FilterPOIPartner.DONATIONS,
          FilterPOIPartner.VOLUNTEERS,
        ].map((partnerFilter, i) => (
          <TextFilter
            key={partnerFilter}
            category={FilterPOICategory.PARTNERS}
            index={i + 1}
            partner={partnerFilter}
          />
        ))
      }
    </S.SectionContainer>
  )
}
