import Divider from '@material-ui/core/Divider'
import React from 'react'
import { useSelector } from 'react-redux'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { selectFeedIsFetching } from 'src/core/useCases/feed'
import { colors } from 'src/styles'
import { FilterEntourageType } from 'src/utils/types'
import { FeedSectionFilters } from './FeedSectionFilters'

export function FeedFilters() {
  const feedIsFetching = useSelector(selectFeedIsFetching)

  return (
    <>
      <FeedSectionFilters color={colors.main.primary} type={FilterEntourageType.ASK_FOR_HELP} />
      <Divider />
      <FeedSectionFilters color={colors.main.blue} type={FilterEntourageType.CONTRIBUTION} />
      {
        feedIsFetching && <OverlayLoader />
      }
    </>
  )
}
