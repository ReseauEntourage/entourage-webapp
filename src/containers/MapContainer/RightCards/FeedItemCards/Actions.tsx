import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'src/components/Button'
import { openModal } from 'src/components/Modal'
import { ModalShare } from 'src/components/ModalShare'
import { constants } from 'src/constants'
import { useCurrentFeedItem } from 'src/containers/MapContainer'
import { ModalCloseAction } from 'src/containers/ModalCloseAction'
import { ModalEditAction } from 'src/containers/ModalEditAction'
import { ModalEditEvent } from 'src/containers/ModalEditEvent'
import { feedActions, selectStatus, RequestStatus, selectIsUpdatingStatus, FeedEntourage } from 'src/core/useCases/feed'
import { AppState } from 'src/core/useCases/reducers'
import { texts } from 'src/i18n'
import { assertIsDefined } from 'src/utils/misc'
import { FeedMetadata } from 'src/utils/types'
import * as S from './Actions.styles'
import { ParticipateButton } from './ParticipateButton'

interface ActionsProps {
  iAmCreator: boolean;
}

export function Actions(props: ActionsProps) {
  const { iAmCreator } = props
  const feedItem = useCurrentFeedItem() as FeedEntourage
  const dispatch = useDispatch()
  assertIsDefined(feedItem)

  const isUpdatingStatus = useSelector(selectIsUpdatingStatus)
  const status = useSelector<AppState, RequestStatus>((state) => selectStatus(state, feedItem.uuid))

  const onClickReport = useCallback(() => {
    // eslint-disable-next-line no-useless-escape
    window.open(`mailto:${constants.MAIL_TO_REPORT}?subject=Je signale un problème concernant \"${feedItem.title}\"`)
  }, [feedItem.title])

  const onClickShare = useCallback(() => {
    openModal(
      <ModalShare
        content={feedItem.description}
        entourageUuid={feedItem.uuid}
        title={feedItem.title}
      />,
    )
  }, [feedItem.description, feedItem.title, feedItem.uuid])

  const onClickUpdateAction = useCallback(() => {
    openModal(
      <ModalEditAction
        action={{
          id: feedItem.id,
          title: feedItem.title,
          description: feedItem.description,
          displayCategory: feedItem.displayCategory,
          entourageType: feedItem.entourageType,
          displayAddress: feedItem.metadata.displayAddress,
        }}
      />,
    )
  }, [
    feedItem.description,
    feedItem.displayCategory,
    feedItem.entourageType,
    feedItem.id,
    feedItem.metadata.displayAddress,
    feedItem.title,
  ])

  const onClickUpdateEvent = useCallback(() => {
    if (feedItem.groupType === 'outing') {
      // FIX ME: will be fixed with uprade of ts
      // eslint-disable-next-line prefer-destructuring
      const metadata = feedItem.metadata as FeedMetadata<'outing'>
      openModal(
        <ModalEditEvent
          event={{
            id: feedItem.id,
            title: feedItem.title,
            description: feedItem.description,
            startDateISO: metadata.startsAt,
            endDateISO: metadata.endsAt,
            displayAddress: metadata.displayAddress,
            imageUrl: metadata.landscapeThumbnailUrl,
          }}
        />,
      )
    }
  }, [feedItem])

  const onClickClose = useCallback(() => {
    openModal(
      <ModalCloseAction
        entourageUuid={feedItem.uuid}
      />,
    )
  }, [feedItem.uuid])

  const onClickReopen = useCallback(() => {
    dispatch(feedActions.reopenEntourage({ entourageUuid: feedItem.uuid }))
  },
  [dispatch, feedItem.uuid])

  if (status === RequestStatus.CLOSED) {
    return iAmCreator ? (
      <S.ReopenContainer>
        <Button loading={isUpdatingStatus} onClick={onClickReopen} variant="outlined">
          {texts.content.map.actions.reopen}
        </Button>
      </S.ReopenContainer>
    ) : (
      <S.NoActions>
        {texts.content.map.actions.hasBeenClosed}
      </S.NoActions>
    )
  }

  return (
    <S.ActionsContainer>
      <ParticipateButton />
      <Button onClick={onClickShare} variant="outlined">{texts.content.map.actions.share}</Button>
      {iAmCreator ? (
        <>
          <Button
            onClick={feedItem.groupType === 'action' ? onClickUpdateAction : onClickUpdateEvent}
            variant="outlined"
          >
            {texts.content.map.actions.edit}
          </Button>
          <Button loading={isUpdatingStatus} onClick={onClickClose} variant="outlined">
            {texts.content.map.actions.close}
          </Button>
        </>
      ) : (
        <Button onClick={onClickReport} variant="outlined">{texts.content.map.actions.report}</Button>
      )}
    </S.ActionsContainer>
  )
}
