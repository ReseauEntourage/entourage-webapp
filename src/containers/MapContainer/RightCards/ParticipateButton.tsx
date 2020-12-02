import AccessTimeIcon from '@material-ui/icons/AccessTime'
import DoneIcon from '@material-ui/icons/Done'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import React, { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { assertIsDefined } from '../../../utils/misc'
import { useCurrentFeedItem } from '../useCurrentFeedItem'
import { Button } from 'src/components/Button'
import { openModal } from 'src/components/Modal'
import { ModalSignIn } from 'src/containers/ModalSignIn'
import { AppState } from 'src/coreLogic/boostrapStore'
import { selectIsUpdatingJoinStatus, selectJoinRequestStatus, feedActions } from 'src/coreLogic/useCases/feed'
import { useMe } from 'src/hooks/useMe'
import { colors } from 'src/styles'
import { useDelayLoadingNext } from 'src/utils/hooks'
import { ModalLeaveEntourage } from './ModalLeaveEntourage'

export function ParticipateButton() {
  const dispatch = useDispatch()
  const feedItem = useCurrentFeedItem()

  assertIsDefined(feedItem)

  const joinRequestPending = useSelector(selectIsUpdatingJoinStatus)
  const joinRequestStatus = useSelector((state: AppState) => selectJoinRequestStatus(state, feedItem.uuid))
  const [isHover, setIsHover] = useState(false)
  const me = useMe()

  const participateLoading = useDelayLoadingNext(joinRequestPending)

  const iAmCreator = me?.id === feedItem.author.id

  const onClickParticipate = useCallback(() => {
    const onRequestEntourageUser = () => {
      dispatch(feedActions.joinEntourage({ entourageUuid: feedItem.uuid }))
    }

    if (!me) {
      openModal(<ModalSignIn onSuccess={onRequestEntourageUser} />)
    } else {
      onRequestEntourageUser()
    }
  }, [dispatch, feedItem.uuid, me])

  const onClickPending = useCallback(() => {
    openModal(<ModalLeaveEntourage entourageUuid={feedItem.uuid} />)
  }, [feedItem.uuid])

  if (joinRequestStatus === 'NOT_REQUEST') {
    return <Button loading={participateLoading} onClick={onClickParticipate}>Participer</Button>
  }

  if (iAmCreator) {
    return (
      <Button disabled={true} startIcon={<DoneIcon />}>
        Créateur
      </Button>
    )
  }

  if (joinRequestStatus === 'PENDING') {
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

  if (joinRequestStatus === 'ACCEPTED') {
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
