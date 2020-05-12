import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import { formatDistance } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import Link from 'next/link'
import React, { useCallback } from 'react'
import { Button } from 'src/components/Button'
import { openModal } from 'src/components/Modal'
import { ModalShare } from 'src/components/ModalShare'
import { ActionCard, EventCard } from 'src/components/RightCards'
import { UsersList } from 'src/components/UsersList'
import { constants } from 'src/constants'
import { useMainStore } from 'src/containers/MainStore'
import { ModalEditAction } from 'src/containers/ModalEditAction'
import { ModalEditEvent } from 'src/containers/ModalEditEvent'
import { useQueryEntourageUsers, useQueryMe, UseQueryFeedItem } from 'src/core/store'
import { variants } from 'src/styles'
import { useMount } from 'src/utils/hooks'
import { ParticipateButton } from './ParticipateButton'

interface RightCardsProps {
  feedItem: UseQueryFeedItem;
}

export function RightCards(props: RightCardsProps) {
  const { feedItem } = props
  const mainContext = useMainStore()
  const [entourageUsers] = useQueryEntourageUsers(feedItem.uuid)
  const { data: dataMe } = useQueryMe()

  const iAmCreator = dataMe?.data.user.id === feedItem.author.id

  useMount(() => {
    if (feedItem) {
      mainContext.onChangeFeedItem(feedItem)
    }
  })

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

  if (!feedItem) {
    return null
  }

  let card: React.ReactNode

  if (feedItem.groupType === 'action') {
    const { author, title, description, entourageType, metadata } = feedItem
    const { partner } = author

    const organizerName = partner ? partner.name : author.displayName
    const createdAtDistance = formatDistance(new Date(feedItem.createdAt), new Date(), { locale: fr })
    const updatedAtDistance = formatDistance(new Date(feedItem.updatedAt), new Date(), { locale: fr })
    const dataLabel = `Crée il y a ${createdAtDistance} - actif il y a ${updatedAtDistance}`
    const organizerLabelActionType = entourageType === 'contribution'
      ? 'Contribution'
      : 'Demande'

    const organizerLabel = (
      <div>
        <div>{organizerLabelActionType} par <b>{organizerName}</b></div>
        <div>à {metadata.displayAddress}</div>
      </div>
    )

    card = (
      <ActionCard
        actions={(
          <Box display="flex" justifyContent="space-around" marginX={4} marginY={2}>
            <ParticipateButton feedItem={feedItem} />
            <Button onClick={onClickShare} variant="outlined">Partager</Button>
            {iAmCreator ? (
              <Button onClick={onClickUpdateAction} variant="outlined">Modifier</Button>
            ) : (
              <Button onClick={onClickReport} variant="outlined">Signaler</Button>
            )}
          </Box>
        )}
        dateLabel={dataLabel}
        description={description}
        isAssociation={!!partner}
        organizerLabel={organizerLabel}
        organizerPictureURL={author.avatarUrl}
        title={title}
      />
    )
  }

  if (feedItem.groupType === 'outing') {
    const startDate = new Date(feedItem.metadata.startsAt)
    const startHour = startDate.toLocaleTimeString().replace(/([0-9]*)?:([0-9]*)?:([0-9]*)?/g, '$1h$2')
    const endDate = new Date(feedItem.metadata.endsAt)
    const endHour = endDate.toLocaleTimeString().replace(/([0-9]*)?:([0-9]*)?:([0-9]*)?/g, '$1h$2')
    const dateLabel = `${startDate.toDateString()} de ${startHour} à ${endHour}`

    card = (
      <EventCard
        actions={(
          <Box display="flex" justifyContent="space-around" marginX={4} marginY={2}>
            <ParticipateButton feedItem={feedItem} />
            <Button onClick={onClickShare} variant="outlined">Partager</Button>
            {iAmCreator ? (
              <Button onClick={onClickUpdateEvent} variant="outlined">Modifier</Button>
            ) : (
              <Button onClick={onClickReport} variant="outlined">Signaler</Button>
            )}
          </Box>
        )}
        address={feedItem.metadata.displayAddress}
        dateLabel={dateLabel}
        description={feedItem.description}
        organizerLabel={feedItem.author.displayName}
        organizerPictureURL={feedItem.author.avatarUrl}
        title={feedItem.title}
      />
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      paddingY={2}
      style={{
        boxSizing: 'border-box',
      }}
    >
      <Box display="flex" justifyContent="flex-end" marginRight={1}>
        <Link href="/actions">
          <a>
            <CloseIcon color="primary" fontSize="large" />
          </a>
        </Link>
      </Box>
      <Box marginX={4}>
        {card}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        marginTop={2}
        marginX={4}
        overflow="hidden"
      >
        <Typography style={{ textTransform: 'uppercase' }} variant={variants.title1}>
          Participants
        </Typography>
        <UsersList
          users={entourageUsers.map((user) => ({
            userId: `${user.id}`,
            userName: user.displayName,
            profilePictureURL: user.avatarUrl,
            isOwner: feedItem.author.id === user.id,
            isPartner: !!user.partner,
            partnerName: user.partner ? user.partner.name : undefined,
          }))}
        />
      </Box>
    </Box>
  )
}
