import Typography from '@material-ui/core/Typography'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'src/components/Button'
import { Modal, useModalContext } from 'src/components/Modal'
import { feedActions, selectIsUpdatingStatus } from 'src/core/useCases/feed'
import { l18n } from 'src/i18n'
import { variants } from 'src/styles'
import { usePrevious } from 'src/utils/hooks'
import * as S from './ModalCloseAction.styles'

interface ModalCloseActionProps {
  entourageUuid: string;
}

export function ModalCloseAction(props: ModalCloseActionProps) {
  const { entourageUuid } = props
  const { onClose } = useModalContext()
  const dispatch = useDispatch()
  const isUpdatingStatus = useSelector(selectIsUpdatingStatus)
  const wasUpdatingStatus = usePrevious(isUpdatingStatus)
  const closeOnNextRender = wasUpdatingStatus && !isUpdatingStatus

  const onValidate = useCallback((success: boolean) => {
    dispatch(feedActions.closeEntourage({ entourageUuid, success }))

    return false
  }, [dispatch, entourageUuid])

  return (
    <Modal
      actions={(
        <>
          <Button color="primary" onClick={onClose} tabIndex={-1} variant="outlined">Annuler</Button>
          <Button onClick={() => onValidate(true)} startIcon={<ThumbUpIcon />}>
            {l18n().content.modalCloseAction.success}
          </Button>
          <Button onClick={() => onValidate(false)} startIcon={<ThumbDownIcon />}>
            {l18n().content.modalCloseAction.fail}
          </Button>
        </>
      )}
      closeOnNextRender={closeOnNextRender}
      showCloseButton={true}
    >
      <S.Title>{l18n().content.modalCloseAction.subtitle}</S.Title>
      <Typography variant={variants.bodyRegular}>{l18n().content.modalCloseAction.body}</Typography>
    </Modal>
  )
}
