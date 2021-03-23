import Divider from '@material-ui/core/Divider'
import React from 'react'
import { useSelector } from 'react-redux'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { selectPOIsIsFetching } from 'src/core/useCases/pois'
import { FilterPOICategory } from 'src/utils/types'
import { POIsCategoryFilters } from './POIsCategoryFilters'
import { POIsPartnersFilters } from './POIsPartnersFilters'

export function POIsFilters() {
  const poisIsFetching = useSelector(selectPOIsIsFetching)

  return (
    <>
      <POIsPartnersFilters category={FilterPOICategory.PARTNERS} />
      <Divider />
      <POIsCategoryFilters />
      {
        poisIsFetching && <OverlayLoader />
      }
    </>
  )
}
