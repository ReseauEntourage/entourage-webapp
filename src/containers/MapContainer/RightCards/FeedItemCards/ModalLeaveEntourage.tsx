import Typography from '@material-ui/core/Typography'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'src/components/Modal'
import { feedActions, selectIsUpdatingJoinStatus } from 'src/core/useCases/feed'
import { useMeNonNullable } from 'src/hooks/useMe'
import { variants } from 'src/styles'
import { usePrevious } from 'src/utils/hooks'

interface ModalLeaveEntourageProps {
  entourageUuid: string;
}

export function ModalLeaveEntourage(props: ModalLeaveEntourageProps) {
  const me = useMeNonNullable()
  const dispatch = useDispatch()
  const { entourageUuid } = props
  const isUpdatingJoinStatus = useSelector(selectIsUpdatingJoinStatus)
  const wasUpdatingJoinStatus = usePrevious(isUpdatingJoinStatus)
  const closeOnNextRender = wasUpdatingJoinStatus && !isUpdatingJoinStatus

  const onValidate = useCallback(() => {
    dispatch(feedActions.leaveEntourage({ entourageUuid, userId: me.id }))

    return false
  }, [dispatch, entourageUuid, me.id])

  return (
    <Modal
      closeOnNextRender={closeOnNextRender}
      onValidate={onValidate}
      validateLabel="Oui, quitter"
    >
      <Typography variant={variants.title1}>
        Souhaitez vous vraiment quitter cette action ?
      </Typography>
    </Modal>
  )
}
