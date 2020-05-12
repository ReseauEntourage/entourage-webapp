import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import CloseIcon from '@material-ui/icons/Close'
import DoneIcon from '@material-ui/icons/Done'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { formatDistance } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { Button } from 'src/components/Button'
import { Modal, openModal } from 'src/components/Modal'
import { ModalShare } from 'src/components/ModalShare'
import { ActionCard, EventCard } from 'src/components/RightCards'
import { UsersList } from 'src/components/UsersList'
import { constants } from 'src/constants'
import { useMainStore } from 'src/containers/MainStore'
import { ModalSignIn } from 'src/containers/ModalSignIn'

import {
  useQueryEntourageUsers,
  useMutateEntourageUsers,
  useMutateDeleteEntourageUser,
  useQueryMe,
  useQueryMeNonNullable,
  UseQueryFeedItem,
  useQueryIAmLogged,
} from 'src/core/store'
import { variants, colors } from 'src/styles'
import { useMount, useDelayLoading } from 'src/utils/hooks'
import { assertIsDefined } from 'src/utils/misc'

interface ModalLeaveEntourageProps {
  entourageId: number;
}

function ModalLeaveEntourage(props: ModalLeaveEntourageProps) {
  const { entourageId } = props
  const [deleteEntourageUser] = useMutateDeleteEntourageUser()
  const me = useQueryMeNonNullable()

  assertIsDefined(me.id)

  const onValidate = useCallback(async () => {
    try {
      await deleteEntourageUser({ entourageId, userId: me.id }, { waitForRefetchQueries: true })
      return true
    } catch (e) {
      return false
    }
  }, [deleteEntourageUser, entourageId, me.id])

  return (
    <Modal
      onValidate={onValidate}
      validateLabel="Oui, quitter"
    >
      <Typography variant={variants.title1}>
        Souhaitez vous vraiment quitter cette action ?
      </Typography>
    </Modal>
  )
}

interface ParticipateButtonProps extends RightCardsProps {}

function ParticipateButton(props: ParticipateButtonProps) {
  const { feedItem } = props
  const [isHover, setIsHover] = useState(false)
  const [requestEntourageUser] = useMutateEntourageUsers()
  const { data: dataMe } = useQueryMe()
  const iAmLogged = useQueryIAmLogged()
  const [participateLoading, setParticipateLoading] = useDelayLoading()

  const iAmCreator = dataMe?.data.user.id === feedItem.author.id

  const onRequestEntourageUser = useCallback(async () => {
    setParticipateLoading(true)
    await requestEntourageUser({ entourageId: feedItem.id }, { waitForRefetchQueries: true })
    setParticipateLoading(false)
  }, [setParticipateLoading, feedItem, requestEntourageUser])

  const onClickParticipate = useCallback(() => {
    if (!iAmLogged) {
      openModal(<ModalSignIn onSuccess={onRequestEntourageUser} />)
    } else {
      onRequestEntourageUser()
    }
  }, [iAmLogged, onRequestEntourageUser])

  const onClickPending = useCallback(() => {
    openModal(<ModalLeaveEntourage entourageId={feedItem.id} />)
  }, [feedItem.id])

  if (feedItem.joinStatus === 'not_requested' || feedItem.joinStatus === 'cancelled') {
    return <Button loading={participateLoading} onClick={onClickParticipate}>Participer</Button>
  }

  if (iAmCreator) {
    return (
      <Button disabled={true} startIcon={<DoneIcon />}>
        Créateur
      </Button>
    )
  }

  if (feedItem.joinStatus === 'pending') {
    return (
      <Button
        onClick={onClickPending}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        startIcon={isHover ? <ExitToAppIcon /> : <AccessTimeIcon />}
        style={{
          backgroundColor: isHover ? colors.main.red : undefined,
        }}
      >
        {isHover ? 'Annuler' : 'En attente'}
      </Button>
    )
  }

  if (feedItem.joinStatus === 'accepted') {
    return (
      <Button
        onClick={onClickPending}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        startIcon={isHover ? <ExitToAppIcon /> : <DoneIcon />}
        style={{
          backgroundColor: isHover ? colors.main.red : undefined,
        }}
      >
        {isHover ? 'Quitter' : 'Membre'}
      </Button>
    )
  }

  return null
}

interface RightCardsProps {
  feedItem: UseQueryFeedItem;
}

export function RightCards(props: RightCardsProps) {
  const { feedItem } = props
  const mainContext = useMainStore()
  const [entourageUsers] = useQueryEntourageUsers(feedItem.uuid)

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
        actions={(
          <Box display="flex" justifyContent="space-around" marginX={4} marginY={2}>
            <ParticipateButton feedItem={feedItem} />
            <Button onClick={onClickShare} variant="outlined">Partager</Button>
            <Button onClick={onClickReport} variant="outlined">Signaler</Button>
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
    card = (
      <EventCard
        address={feedItem.metadata.displayAddress}
        dateLabel={new Date(feedItem.createdAt).toLocaleDateString()}
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
      {/* <Box flexGrow="1" /> */}
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

// DO NOT COMMIT THIS
// eudqg_PfiOXU