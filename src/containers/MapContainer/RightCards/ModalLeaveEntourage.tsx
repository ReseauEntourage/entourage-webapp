import Typography from '@material-ui/core/Typography'
import React, { useCallback } from 'react'
import { Modal } from 'src/components/Modal'
import { useMutateDeleteEntourageUser, useQueryMeNonNullable } from 'src/core/store'
import { variants } from 'src/styles'
import { assertIsDefined } from 'src/utils/misc'

interface ModalLeaveEntourageProps {
  entourageUuid: string;
}

export function ModalLeaveEntourage(props: ModalLeaveEntourageProps) {
  const { entourageUuid } = props
  const [deleteEntourageUser] = useMutateDeleteEntourageUser()
  const me = useQueryMeNonNullable()

  assertIsDefined(me.id)

  const onValidate = useCallback(async () => {
    try {
      await deleteEntourageUser({ entourageUuid, userId: me.id }, { waitForRefetchQueries: true })
      return true
    } catch (e) {
      return false
    }
  }, [deleteEntourageUser, entourageUuid, me.id])

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
