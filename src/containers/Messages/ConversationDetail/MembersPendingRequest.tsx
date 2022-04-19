import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Button, ButtonsList } from 'src/components/Button'
import { PendingNotif } from 'src/components/Conversations'
import {
  useQueryMembersPending,
  useMutateAcceptEntourageUser,
  useMutateDeleteEntourageUser,
} from 'src/core/store'
import { selectCurrentConversation } from 'src/core/useCases/messages'
import { useMeNonNullable } from 'src/hooks/useMe'
import { colors } from 'src/styles'
import { useDelayLoading } from 'src/utils/hooks'
import * as S from './MembersPendingRequest.styles'

interface MembersPendingRequestProps {
  entourageUuid: string;
}

export function MembersPendingRequest(props: MembersPendingRequestProps) {
  const { entourageUuid } = props

  const [deleting, setDeleting] = useDelayLoading()
  const [accepting, setAccepting] = useDelayLoading()
  // TODO REPLACE QUERYS
  const { membersPending } = useQueryMembersPending(entourageUuid)
  const me = useMeNonNullable()
  const entourage = useSelector(selectCurrentConversation)
  const iAmAuthor = me.id === entourage?.author.id

  const [accepteEntourageUser] = useMutateAcceptEntourageUser()
  const [deleteEntourageUser] = useMutateDeleteEntourageUser()

  const currentMemberPending = membersPending[0]
  const nextMemberPending = membersPending[1]

  const onValidateRequest = useCallback(async () => {
    setAccepting(true)
    await accepteEntourageUser({ entourageUuid, userId: currentMemberPending.id }, { waitForRefetchQueries: true })
    setAccepting(false)
  }, [accepteEntourageUser, currentMemberPending, entourageUuid, setAccepting])

  const onRejectRequest = useCallback(async () => {
    setDeleting(true)
    await deleteEntourageUser({ entourageUuid, userId: currentMemberPending.id }, { waitForRefetchQueries: true })
    setDeleting(false)
  }, [setDeleting, deleteEntourageUser, entourageUuid, currentMemberPending])

  if (!iAmAuthor || !currentMemberPending) {
    return null
  }

  return (
    <S.Container>
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
              style={{ backgroundColor: colors.main.white }}
              variant="outlined"
            >
              Refuser
            </Button>
          </ButtonsList>
        )}
        userId={currentMemberPending.id}
      />
      {nextMemberPending && (
        <PendingNotif
          pictureURL={nextMemberPending.avatarUrl}
          style={{
            borderRadius: 0,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
          }}
          userId={currentMemberPending.id}
        />
      )}
    </S.Container>
  )
}
