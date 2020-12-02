import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import React, { useCallback, useEffect } from 'react'
import { Button } from 'src/components/Button'
import { colors, variants } from 'src/styles'
import { useDelayLoading } from 'src/utils/hooks'
import { AnyToFix } from 'src/utils/types'
import * as S from './Modal.styles'
import { useModalContext } from './ModalContext'

interface BaseProps {
  children?: AnyToFix;
  onClose?: () => void;
  onValidate?: () => void | boolean | Promise<void | boolean>;
  showCloseButton?: boolean;
  title?: string;
}

interface BasicModalProps extends BaseProps {
  cancel?: boolean;
  cancelLabel?: string;
  validate?: boolean;
  validateLabel?: string;
  closeOnNextRender?: boolean;
}

interface CustomModalProps extends BaseProps {
  customActions: (close?: () => void) => JSX.Element;
}

const defaultProps = {
  validateLabel: 'Valider',
  cancelLabel: 'Annuler',
  validate: true,
  cancel: true,
}

export function Modal(props: BasicModalProps | CustomModalProps) {
  const {
    title,
    children,
    validate,
    cancel,
    validateLabel,
    cancelLabel,
    onValidate: onValidateProp,
    onClose: onCloseProp,
    showCloseButton,
    closeOnNextRender,
    customActions,
  } = { ...defaultProps, ...props }

  const modalContext = useModalContext()
  const onClose = modalContext ? modalContext.onClose : onCloseProp
  const [loading, setLoading] = useDelayLoading(false)

  const onValidate = useCallback(async () => {
    if (onValidateProp) {
      setLoading(true)
      const onValidateRes = await onValidateProp()
      await setLoading(false)
      if (onValidateRes === false) {
        return
      }
    }

    if (onClose) {
      onClose()
    }
  }, [onClose, onValidateProp, setLoading])

  useEffect(() => {
    if (closeOnNextRender && onClose) {
      onClose()
    }
  }, [closeOnNextRender, onClose])

  const hasCTAButtons = validate || cancel || customActions

  return (
    <Dialog
      aria-labelledby="form-dialog-title"
      disableBackdropClick={true}
      onClose={onClose}
      open={true}
    >
      <S.GlobalStyle />
      {title ? (
        <DialogTitle
          id="form-dialog-title"
          style={{
            backgroundColor: colors.main.primary,
            color: '#fff',
            textAlign: 'center',
            paddingLeft: showCloseButton ? 60 : 20,
            paddingRight: showCloseButton ? 60 : 20,
          }}
        >
          {title}
          {showCloseButton && (
            <S.CloseIconContainer aria-label="close" onClick={onClose}>
              <CloseIcon style={{ color: 'white' }} />
            </S.CloseIconContainer>
          )}
        </DialogTitle>
      ) : (
        <> { showCloseButton ? (
          <S.CloseIconContainer aria-label="close" onClick={onClose}>
            <CloseIcon color="primary" />
          </S.CloseIconContainer>
        ) : null}
        </>
      )}
      <Typography component={DialogContent} variant={variants.bodyRegular}>
        {children}
      </Typography>
      {hasCTAButtons ? (
        <DialogActions>
          {customActions
            ? customActions(onClose)
            : (
              <>
                {cancel
                  ? (
                    <Button color="primary" onClick={onClose} tabIndex={-1} variant="outlined">
                      {cancelLabel}
                    </Button>
                  ) : null}
                {validate ? (
                  <Button color="primary" loading={loading} onClick={onValidate}>
                    {validateLabel}
                  </Button>
                ) : null }
              </>
            )}

        </DialogActions>
      ) : null }
    </Dialog>
  )
}
