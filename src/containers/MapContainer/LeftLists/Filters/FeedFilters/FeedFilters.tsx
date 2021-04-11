import Divider from '@material-ui/core/Divider'
import { Event } from '@material-ui/icons'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as S from '../Filters.styles'
import { LineFilter } from '../LineFilter'
import { OverlayLoader } from 'src/components/OverlayLoader'
import {
  feedActions,
  selectFeedIsFetching,
  selectIsActiveEventsFilter,
  selectTimeRangeFilter,
} from 'src/core/useCases/feed'
import { texts } from 'src/i18n'
import { colors, variants } from 'src/styles'
import { FilterEntourageType } from 'src/utils/types'
import { FeedActionTypesSectionFilters } from './FeedActionTypesSectionFilters'

const marks = [
  {
    value: 1 * 24,
    label: '24H',
  },
  {
    value: 8 * 24,
    label: '8J',
  },
  {
    value: 30 * 24,
    label: '1M',
  },
]

export function FeedFilters() {
  const feedIsFetching = useSelector(selectFeedIsFetching)
  const eventChecked = useSelector(selectIsActiveEventsFilter)
  const selectedTimeRange = useSelector(selectTimeRangeFilter)

  const dispatch = useDispatch()

  const toggleEventsFilter = useCallback(() => {
    dispatch(feedActions.toggleEventsFilter())
  }, [dispatch])

  const onTimeRangeClick = useCallback((value: number) => {
    dispatch(feedActions.setTimeRangeFilter(value))
  }, [dispatch])

  return (
    <>
      <S.Title>{texts.content.map.filters.events}</S.Title>
      <S.SectionContainer>
        <LineFilter
          checked={eventChecked}
          Icon={Event}
          label={texts.content.map.filters.events}
          onChange={toggleEventsFilter}
          variant={variants.title2}
        />
      </S.SectionContainer>
      <S.Title>{texts.content.map.filters.actionTypes}</S.Title>
      <FeedActionTypesSectionFilters color={colors.main.primary} type={FilterEntourageType.ASK_FOR_HELP} />
      <Divider />
      <FeedActionTypesSectionFilters color={colors.main.blue} type={FilterEntourageType.CONTRIBUTION} />
      <S.Title>{texts.content.map.filters.updatedBefore}</S.Title>
      <S.CircleContainer>
        {marks.map((mark) => (
          <S.Circle
            key={mark.value}
            isActive={Boolean(selectedTimeRange === mark.value)}
            onClick={() => onTimeRangeClick(mark.value)}
          >
            {mark.label}
          </S.Circle>
        ))}
      </S.CircleContainer>
      {
        feedIsFetching && <OverlayLoader />
      }
    </>
  )
}
