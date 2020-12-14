import Typography from '@material-ui/core/Typography'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'src/components/Button'
import { Modal } from 'src/components/Modal'
import { feedActions } from 'src/core/useCases/feed'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'
import * as S from './ModalCloseAction.styles'

interface ModalCloseActionProps {
  entourageUuid: string;
}

export function ModalCloseAction(props: ModalCloseActionProps) {
  const { entourageUuid } = props
  const dispatch = useDispatch()

  const onValidate = useCallback((success: boolean, cb?: () => void) => {
    dispatch(feedActions.closeEntourage({ entourageUuid, success }))

    if (cb) {
      cb()
    }

    return true
  }, [dispatch, entourageUuid])

  const customActions = (close?: () => void) => (
    <>
      <Button color="primary" onClick={close} tabIndex={-1} variant="outlined">Annuler</Button>
      <Button
        onClick={() => onValidate(true, close)}
        startIcon={<ThumbUpIcon />}
      >
        {texts.content.modalCloseAction.success}
      </Button>
      <Button
        onClick={() => onValidate(false, close)}
        startIcon={<ThumbDownIcon />}
      >
        {texts.content.modalCloseAction.fail}
      </Button>
    </>
  )
  return (
    <Modal
      customActions={customActions}
      showCloseButton={true}
    >
      <S.Title>{texts.content.modalCloseAction.subtitle}</S.Title>
      <Typography variant={variants.bodyRegular}>{texts.content.modalCloseAction.body}</Typography>
    </Modal>
  )
}
