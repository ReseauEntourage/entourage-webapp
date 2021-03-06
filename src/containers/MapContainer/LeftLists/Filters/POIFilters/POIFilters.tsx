import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'src/components/Button'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { poisActions, selectAreFiltersDisabled, selectPOIsIsFetching } from 'src/core/useCases/pois'
import { texts } from 'src/i18n'
import { FilterPOICategory } from 'src/utils/types'
import { POICategoryFilters } from './POICategoryFilters'
import { POIPartnersFilters } from './POIPartnersFilters'

export function POIFilters() {
  const poisIsFetching = useSelector(selectPOIsIsFetching)
  const dispatch = useDispatch()
  const areFiltersDisabled = useSelector(selectAreFiltersDisabled)

  const onResetFilters = useCallback(() => {
    dispatch(poisActions.resetPOIsFilters())
  }, [dispatch])

  return (
    <>
      <Box alignItems="center" display="flex" justifyContent="flex-end" marginRight={1}>
        <Button
          disabled={areFiltersDisabled}
          onClick={onResetFilters}
          size="small"
          variant="text"
        >
          {texts.content.map.filters.disableFilters}
        </Button>
      </Box>
      <POIPartnersFilters category={FilterPOICategory.PARTNERS} />
      <Divider />
      <POICategoryFilters />
      {
        poisIsFetching && <OverlayLoader />
      }
    </>
  )
}
