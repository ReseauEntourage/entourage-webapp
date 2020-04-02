import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import React, { useCallback } from 'react'
import { Button, ButtonsList } from 'src/components/Button'
import { PendingNotif } from 'src/components/Conversations'
import {
  useQueryMembersPending,
  useQueryMeNonNullable,
  useQueryEntourageFromMyFeeds,
  useMutateAcceptEntourageUser,
  useMutateDeleteEntourageUser,
} from 'src/core/store'
import { useDelayLoading } from 'src/utils/hooks'
import { Container } from './MembersPendingRequest.styles'

interface MembersPendingRequestProps {
  entourageId: number;
}

export function MembersPendingRequest(props: MembersPendingRequestProps) {
  const { entourageId } = props

  const [deleting, setDeleting] = useDelayLoading()
  const [accepting, setAccepting] = useDelayLoading()
  const { membersPending } = useQueryMembersPending(entourageId)
  const me = useQueryMeNonNullable()
  const entourage = useQueryEntourageFromMyFeeds(entourageId)
  const iAmAuthor = me.id === entourage.author.id

  const [accepteEntourageUser] = useMutateAcceptEntourageUser()
  const [deleteEntourageUser] = useMutateDeleteEntourageUser()

  const currentMemberPending = membersPending[0]
  const nextMemberPending = membersPending[1]

  const onValidateRequest = useCallback(async () => {
    setAccepting(true)
    await accepteEntourageUser({ entourageId, userId: currentMemberPending.id }, { waitForRefetchQueries: true })
    setAccepting(false)
  }, [accepteEntourageUser, currentMemberPending, entourageId, setAccepting])

  const onRejectRequest = useCallback(async () => {
    setDeleting(true)
    await deleteEntourageUser({ entourageId, userId: currentMemberPending.id }, { waitForRefetchQueries: true })
    setDeleting(false)
  }, [deleteEntourageUser, currentMemberPending, entourageId, setDeleting])

  if (!iAmAuthor || !currentMemberPending) {
    return null
  }

  return (
    <Container>
      <PendingNotif
        key={currentMemberPending.id}
        label={<div><b>{currentMemberPending.displayName} souhaite rejoindre votre action</b></div>}
        pictureURL={currentMemberPending.avatarUrl}
        rightContent={(
          <ButtonsList>
            <Button
              loading={accepting}
              onClick={onValidateRequest}
              startIcon={<CheckIcon />}
            >
              Accepter
            </Button>
            <Button
              loading={deleting}
              onClick={onRejectRequest}
              startIcon={<CloseIcon />}
              style={{ backgroundColor: '#fff' }}
              variant="outlined"
            >
              Refuser
            </Button>
          </ButtonsList>
        )}
      />
      {nextMemberPending && (
        <PendingNotif
          pictureURL={nextMemberPending.avatarUrl}
          style={{
            borderRadius: 0,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
          }}
        />
      )}
    </Container>
  )
}
