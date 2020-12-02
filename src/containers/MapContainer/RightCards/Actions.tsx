import React, { useCallback } from 'react'
import { useCurrentFeedItem } from '../useCurrentFeedItem'
import { Button } from 'src/components/Button'
import { openModal } from 'src/components/Modal'
import { ModalShare } from 'src/components/ModalShare'
import { constants } from 'src/constants'
import { ModalCloseAction } from 'src/containers/ModalCloseAction'
import { ModalEditAction } from 'src/containers/ModalEditAction'
import { ModalEditEvent } from 'src/containers/ModalEditEvent'
import { useMutateReopenEntourages } from 'src/core/store'
import { texts } from 'src/i18n'
import { assertIsDefined } from 'src/utils/misc'
import * as S from './Actions.styles'
import { ParticipateButton } from './ParticipateButton'

interface ActionsProps {
  iAmCreator: boolean;
}

export function Actions(props: ActionsProps) {
  const { iAmCreator } = props
  const feedItem = useCurrentFeedItem()
  assertIsDefined(feedItem)

  const [reopenEntourage] = useMutateReopenEntourages()

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
    openModal(
      <ModalEditEvent
        event={{
          id: feedItem.id,
          title: feedItem.title,
          description: feedItem.description,
          dateISO: feedItem.metadata.startsAt,
          displayAddress: feedItem.metadata.displayAddress,
        }}
      />,
    )
  }, [feedItem])

  const onClickClose = useCallback(() => {
    openModal(
      <ModalCloseAction
        id={feedItem.id}
      />,
    )
  }, [
    feedItem.id,
  ])

  const onClickReopen = useCallback(async () => {
    await reopenEntourage({ id: feedItem.id })
  },
  [feedItem.id, reopenEntourage])

  if (feedItem.status === 'closed') {
    return iAmCreator ? (
      <S.ReopenContainer>
        <Button onClick={onClickReopen} variant="outlined">{texts.content.map.rightCards.reopen}</Button>
      </S.ReopenContainer>
    ) : (
      <S.NoActionsSpan>
        {texts.content.map.rightCards.hasBeenClosed}
      </S.NoActionsSpan>
    )
  }

  return (
    <S.ActionsContainer>
      <ParticipateButton />
      <Button onClick={onClickShare} variant="outlined">{texts.content.map.rightCards.share}</Button>
      {iAmCreator ? (
        <>
          <Button
            onClick={feedItem.groupType === 'action' ? onClickUpdateAction : onClickUpdateEvent}
            variant="outlined"
          >
            {texts.content.map.rightCards.edit}
          </Button>
          <Button onClick={onClickClose} variant="outlined">{texts.content.map.rightCards.close}</Button>
        </>
      ) : (
        <Button onClick={onClickReport} variant="outlined">{texts.content.map.rightCards.report}</Button>
      )}
    </S.ActionsContainer>
  )
}
