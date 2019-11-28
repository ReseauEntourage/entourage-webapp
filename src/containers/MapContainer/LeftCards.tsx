import React from 'react'
import Link from 'next/link'
import Box from '@material-ui/core/Box'
import CloseIcon from '@material-ui/icons/Close'
import { formatDistance } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import { Typography } from '@material-ui/core'
import { useMount } from 'src/hooks'
import { FeedItem } from 'src/network/api'
import { useQueryEntourageUsers } from 'src/network/queries'
import { Button } from 'src/components/Button'
import { useMainContext } from 'src/containers/MainContext'
import { ActionCard, EventCard } from 'src/components/LeftCards'
import { UsersList } from 'src/components/UsersList'
import { variants } from 'src/styles'

interface Props {
  feedItem: FeedItem;
}

export function LeftCards(props: Props) {
  const { feedItem } = props
  const mainContext = useMainContext()

  const [entourageUsers] = useQueryEntourageUsers(feedItem.uuid)

  useMount(() => {
    if (feedItem) {
      mainContext.onChangeFeedItem(feedItem)
    }
  })

  if (!feedItem) {
    return null
  }

  let card: React.ReactNode

  if (feedItem.groupType === 'action') {
    const { author, title, description, entourageType } = feedItem
    const { partner } = author

    const organizerName = partner ? partner.name : author.displayName
    const createdAtDistance = formatDistance(new Date(feedItem.createdAt), new Date(), { locale: fr })
    const updatedAtDistance = formatDistance(new Date(feedItem.updatedAt), new Date(), { locale: fr })
    const dataLabel = `Crée il y a ${createdAtDistance} - actif il y a ${updatedAtDistance}`
    const organizerLabelActionType = entourageType === 'contribution'
      ? 'Contribution'
      : 'Demande'

    const organizerLabel = <div>{organizerLabelActionType} par <b>{organizerName}</b></div>

    card = (
      <ActionCard
        title={title}
        description={description}
        dateLabel={dataLabel}
        organizerLabel={organizerLabel}
        organizerPictureURL={author.avatarUrl}
        isAssociation={!!partner}
      />
    )
  }

  if (feedItem.groupType === 'outing') {
    card = (
      <EventCard
        title={feedItem.title}
        description={feedItem.description}
        dateLabel={new Date(feedItem.createdAt).toLocaleDateString()}
        organizerLabel={feedItem.author.displayName}
        organizerPictureURL={feedItem.author.avatarUrl}
        address={feedItem.metadata.displayAddress}
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
      <Box marginRight={1} display="flex" justifyContent="flex-end">
        <Link href="/actions">
          <a>
            <CloseIcon color="primary" fontSize="large" />
          </a>
        </Link>
      </Box>
      <Box marginX={4}>
        {card}
      </Box>
      <Box marginX={4} marginY={2} display="flex" justifyContent="space-around">
        <Button>
          Participer
        </Button>
        <Button variant="outlined">
          Partager
        </Button>
        <Button variant="outlined">
          Signaler
        </Button>
      </Box>
      {/* <Box flexGrow="1" /> */}
      <Box
        marginX={4}
        marginTop={2}
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <Typography variant={variants.title1} style={{ textTransform: 'uppercase' }}>
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
