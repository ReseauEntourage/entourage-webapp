import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { formatDistance, format } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import capitalize from 'lodash/capitalize'
import React, { useCallback } from 'react'
import { RightCard } from '../RightCard'
import { openModal } from 'src/components/Modal'
import { ActionCard, EventCard } from 'src/components/RightCards'
import { UsersList } from 'src/components/UsersList'
import { useCurrentFeedItem } from 'src/containers/MapContainer'
import { ModalUserCard } from 'src/containers/ModalUserCard'
import { useQueryEntourageUsers } from 'src/core/store'
import { useMe } from 'src/hooks/useMe'
import { variants } from 'src/styles'
import { assertIsDefined } from 'src/utils/misc'
import { Actions } from './Actions'

export function FeedItemCards() {
  const feedItem = useCurrentFeedItem()
  assertIsDefined(feedItem)
  const [entourageUsers] = useQueryEntourageUsers(feedItem.uuid)
  const me = useMe()

  const iAmCreator = me?.id === feedItem.author.id

  const onClickUser = useCallback((userId: number) => {
    openModal(<ModalUserCard userId={userId} />)
  }, [])

  const onClickAuthorAvatar = useCallback(() => {
    onClickUser(feedItem.author.id)
  }, [onClickUser, feedItem.author.id])

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
        actions={<Actions iAmCreator={iAmCreator} />}
        dateLabel={dataLabel}
        description={description}
        isAssociation={!!partner}
        onClickAvatar={onClickAuthorAvatar}
        organizerLabel={organizerLabel}
        organizerPictureURL={author.avatarUrl}
        title={title}
      />
    )
  }

  if (feedItem.groupType === 'outing') {
    const startDate = new Date(feedItem.metadata.startsAt)
    const endDate = new Date(feedItem.metadata.endsAt)
    const formattedEndHour = format(endDate, "H'h'mm", { locale: fr })
    const formattedStartDate = format(startDate, "iiii d MMMM 'de' H'h'mm", { locale: fr })
    const dateLabel = capitalize(`${formattedStartDate} à ${formattedEndHour}`)

    card = (
      <EventCard
        actions={<Actions iAmCreator={iAmCreator} />}
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
    <RightCard
      card={card}
      footer={(
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
            onClickUser={onClickUser}
            users={entourageUsers.map((user) => ({
              userId: user.id,
              userName: user.displayName,
              profilePictureURL: user.avatarUrl,
              isOwner: feedItem.author.id === user.id,
              isPartner: !!user.partner,
              partnerName: user.partner ? user.partner.name : undefined,
            }))}
          />
        </Box>
      )}
      href="/actions"
    />
  )
}