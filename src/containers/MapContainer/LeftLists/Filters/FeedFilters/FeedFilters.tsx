import Divider from '@material-ui/core/Divider'
import { Event } from '@material-ui/icons'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as S from '../Filters.styles'
import { LineFilter } from '../LineFilter'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { feedActions, selectFeedIsFetching, selectIsActiveEventsFilter } from 'src/core/useCases/feed'
import { texts } from 'src/i18n'
import { colors, variants } from 'src/styles'
import { FilterEntourageType } from 'src/utils/types'
import { FeedActionTypesSectionFilters } from './FeedActionTypesSectionFilters'

export function FeedFilters() {
  const feedIsFetching = useSelector(selectFeedIsFetching)
  const eventChecked = useSelector(selectIsActiveEventsFilter)

  const dispatch = useDispatch()

  const onChange = useCallback(() => {
    dispatch(feedActions.toggleEventsFilter())
  }, [dispatch])

  return (
    <>
      <S.Title>{texts.content.map.filters.events}</S.Title>
      <S.SectionContainer>
        <LineFilter
          checked={eventChecked}
          Icon={Event}
          label={texts.content.map.filters.events}
          onChange={onChange}
          variant={variants.title2}
        />
      </S.SectionContainer>
      <S.Title>{texts.content.map.filters.actionTypes}</S.Title>
      <FeedActionTypesSectionFilters color={colors.main.primary} type={FilterEntourageType.ASK_FOR_HELP} />
      <Divider />
      <FeedActionTypesSectionFilters color={colors.main.blue} type={FilterEntourageType.CONTRIBUTION} />
      {
        feedIsFetching && <OverlayLoader />
      }
    </>
  )
}
