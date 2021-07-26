import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { formatDistance, format, isSameDay } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import React, { useCallback } from 'react'
import { RightCard } from '../RightCard'
import { openModal } from 'src/components/Modal'
import { ActionCard, EventCard } from 'src/components/RightCards'
import { UsersList } from 'src/components/UsersList'
import { useCurrentFeedItem } from 'src/containers/MapContainer'
import { MetaData } from 'src/containers/MetaData'
import { ModalUserCard } from 'src/containers/ModalUserCard'
import { env } from 'src/core/env'
import { useQueryEntourageUsers } from 'src/core/store'
import { FeedEntourage } from 'src/core/useCases/feed'
import { useMe } from 'src/hooks/useMe'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'
import { assertIsDefined } from 'src/utils/misc'
import { Actions } from './Actions'

export function FeedItemCards() {
  const feedItem = useCurrentFeedItem() as FeedEntourage
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
    const { author, title, description, entourageType, metadata, uuid } = feedItem
    const { partner } = author

    const organizerName = partner ? partner.name : author.displayName
    const createdAtDistance = formatDistance(new Date(feedItem.createdAt), new Date(), { locale: fr })
    const updatedAtDistance = formatDistance(new Date(feedItem.updatedAt), new Date(), { locale: fr })
    const dataLabel = `${texts.content.map.actions.createAt} ${createdAtDistance}`
      + ` - ${texts.content.map.actions.activeAt} ${updatedAtDistance}`
    const organizerLabelActionType = texts.content.map.actions[entourageType]

    const organizerLabel = (
      <div>
        <div>{organizerLabelActionType} {texts.content.map.actions.by} <b>{organizerName}</b></div>
        <div>à {metadata.displayAddress}</div>
      </div>
    )

    const pronoun = partner ? texts.content.map.actions.shareTitles.their : texts.content.map.actions.shareTitles.his

    const shareTitle = entourageType === 'contribution'
      ? `${texts.content.map.actions.shareTitles.help} ${organizerName}`
      + ` ${texts.content.map.actions.shareTitles.realize} ${pronoun} ${texts.content.map.actions.shareTitles.action}`
      : `${texts.content.map.actions.shareTitles.comeToHelp} ${organizerName}`

    card = (
      <>
        <MetaData
          description={`${title}. ${description}`}
          title={shareTitle}
          url={`${env.SERVER_URL}/actions/${uuid}`}
        />
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
      </>
    )
  }

  if (feedItem.groupType === 'outing') {
    const { author, title, description, metadata, uuid, online, eventUrl } = feedItem
    const { partner } = author

    const organizerName = partner ? partner.name : author.displayName

    let dateLabel = ''
    const startDate = new Date(metadata.startsAt)
    if (metadata.endsAt) {
      const endDate = new Date(metadata.endsAt)
      if (!isSameDay(startDate, endDate)) {
        dateLabel = `${
          format(startDate, "'Du' eeee dd MMMM yyyy 'à' HH'h'mm", { locale: fr })
        }  ${
          format(endDate, "'au' eeee dd MMMM yyyy 'à' HH'h'mm", { locale: fr })
        }`
      } else {
        dateLabel = `${
          format(startDate, "'Le' eeee dd MMMM yyyy 'de' HH'h'mm", { locale: fr })
        } ${
          format(endDate, "'à' HH'h'mm", { locale: fr })
        }`
      }
    } else {
      dateLabel = `${format(startDate, "'Le' eeee dd MMMM yyyy 'à' HH'h'mm", { locale: fr })}`
    }

    const shareTitle = `${texts.content.map.actions.shareTitles.participate} ${organizerName}`
    card = (
      <>
        <MetaData
          description={`${title}. ${description}`}
          title={shareTitle}
          url={`${env.SERVER_URL}/actions/${uuid}`}
        />
        <EventCard
          actions={<Actions iAmCreator={iAmCreator} />}
          address={
            online && eventUrl
              ? `${texts.content.map.actions.online} - ${eventUrl}`
              : feedItem.metadata.displayAddress
          }
          dateLabel={dateLabel}
          description={feedItem.description}
          organizerLabel={feedItem.author.displayName}
          organizerPictureURL={feedItem.author.avatarUrl}
          title={feedItem.title}
        />
      </>
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
            {texts.content.map.actions.participants}
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
      imageUrl={feedItem.metadata.landscapeUrl}
      showImage={feedItem.groupType === 'outing'}
    />
  )
}
