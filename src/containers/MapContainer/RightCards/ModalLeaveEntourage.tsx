import Typography from '@material-ui/core/Typography'
import React, { useCallback } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Modal } from 'src/components/Modal'
import { selectJoinRequestStatus, feedActions } from 'src/core/useCases/feed'
import { useMeNonNullable } from 'src/hooks/useMe'
import { variants } from 'src/styles'

interface ModalLeaveEntourageProps {
  entourageUuid: string;
}

export function ModalLeaveEntourage(props: ModalLeaveEntourageProps) {
  const me = useMeNonNullable()
  const dispatch = useDispatch()
  const store = useStore()
  const { entourageUuid } = props

  const onValidate = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      store.subscribe(() => {
        const status = selectJoinRequestStatus(store.getState(), entourageUuid)
        if (status === 'NOT_REQUEST') {
          resolve(true)
        }
      })

      dispatch(feedActions.leaveEntourage({ entourageUuid, userId: me.id }))
    })
  }, [dispatch, entourageUuid, me.id, store])

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
