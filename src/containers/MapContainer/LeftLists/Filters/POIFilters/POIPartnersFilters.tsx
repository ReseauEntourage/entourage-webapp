import React from 'react'
import * as S from '../Filters.styles'
import { FilterPOICategory, FilterPOIPartner } from 'src/utils/types'
import { POICategoryFilter } from './POICategoryFilter'
import { POIPartnerFilter } from './POIPartnerFilter'

interface SectionFilterProps {
  category: FilterPOICategory;
}

export function POIPartnersFilters(props: SectionFilterProps) {
  const { category } = props
  return (
    <S.SectionContainer>
      <POICategoryFilter category={category} index={0} title={true} />
      {
        [
          FilterPOIPartner.DONATIONS,
          FilterPOIPartner.VOLUNTEERS,
        ].map((partnerFilter, i) => (
          <POIPartnerFilter
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
