import React from 'react'
import * as S from '../Filters.styles'
import { FilterPOICategory, FilterPOIPartner } from 'src/utils/types'
import { POIsCategoryFilter } from './POIsCategoryFilter'
import { POIsPartnerFilter } from './POIsPartnerFilter'

interface SectionFilterProps {
  category: FilterPOICategory;
}

export function POIsPartnersFilters(props: SectionFilterProps) {
  const { category } = props
  return (
    <S.SectionContainer>
      <POIsCategoryFilter category={category} index={0} title={true} />
      {
        [
          FilterPOIPartner.DONATIONS,
          FilterPOIPartner.VOLUNTEERS,
        ].map((partnerFilter, i) => (
          <POIsPartnerFilter
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
