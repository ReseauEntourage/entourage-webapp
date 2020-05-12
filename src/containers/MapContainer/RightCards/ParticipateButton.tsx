import AccessTimeIcon from '@material-ui/icons/AccessTime'
import DoneIcon from '@material-ui/icons/Done'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import React, { useCallback, useState } from 'react'
import { Button } from 'src/components/Button'
import { openModal } from 'src/components/Modal'
import { ModalEditAction } from 'src/containers/ModalEditAction'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import {
  useMutateEntourageUsers,
  useQueryMe,
  UseQueryFeedItem,
  useQueryIAmLogged,
} from 'src/core/store'
import { colors } from 'src/styles'
import { useDelayLoading } from 'src/utils/hooks'
import { ModalLeaveEntourage } from './ModalLeaveEntourage'

interface ParticipateButtonProps {
  feedItem: UseQueryFeedItem;
}

export function ParticipateButton(props: ParticipateButtonProps) {
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

  const onClickUpdate = useCallback(() => {
    openModal(
      <ModalEditAction
        action={{
          id: feedItem.id,
          title: feedItem.title,
          description: feedItem.description,
          displayCategory: feedItem.displayCategory,
          entourageType: feedItem.entourageType,
        }}
      />,
    )
  }, [
    feedItem.description,
    feedItem.displayCategory,
    feedItem.entourageType,
    feedItem.id,
    feedItem.title,
  ])

  if (feedItem.joinStatus === 'not_requested' || feedItem.joinStatus === 'cancelled') {
    return <Button loading={participateLoading} onClick={onClickParticipate}>Participer</Button>
  }

  if (iAmCreator) {
    return (
      <Button onClick={onClickUpdate}>
        Modifier
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
