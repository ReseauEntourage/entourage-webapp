import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import React, { useCallback } from 'react'
import { Button } from 'src/components/Button'
import { colors, variants } from 'src/styles'
import { useDelayLoading } from 'src/utils/hooks'
import { AnyToFix } from 'src/utils/types'
import { GlobalStyle, CloseIconContainer } from './Modal.styles'
import { useModalContext } from './ModalContext'

interface ModalProps {
  cancel?: boolean;
  cancelLabel?: string;
  children?: AnyToFix;
  onClose?: () => void;
  onValidate?: () => void | boolean | Promise<void | boolean>;
  showCloseButton?: boolean;
  title?: string;
  validate?: boolean;
  validateLabel?: string;
}

const defaultProps = {
  validateLabel: 'Valider',
  cancelLabel: 'Annuler',
  validate: true,
  cancel: true,
}

export function Modal(props: ModalProps) {
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

  const hasCTAButtons = validate || cancel

  return (
    <Dialog
      aria-labelledby="form-dialog-title"
      disableBackdropClick={true}
      onClose={onClose}
      open={true}
    >
      <GlobalStyle />
      {title && (
        <DialogTitle
          id="form-dialog-title"
          style={{
            backgroundColor: colors.main.primary,
            color: '#fff',
            textAlign: 'center',
            paddingLeft: showCloseButton ? 60 : 0,
            paddingRight: showCloseButton ? 60 : 0,
          }}
        >
          {title}
          {showCloseButton && (
            <CloseIconContainer aria-label="close" onClick={onClose}>
              <CloseIcon style={{ color: 'white' }} />
            </CloseIconContainer>
          )}
        </DialogTitle>
      )}
      <Typography component={DialogContent} variant={variants.bodyRegular}>
        {children}
      </Typography>
      {hasCTAButtons && (
        <DialogActions>
          {cancel && (
            <Button color="primary" onClick={onClose} tabIndex={-1} variant="outlined">
              {cancelLabel}
            </Button>
          )}
          {validate && (
            <Button color="primary" loading={loading} onClick={onValidate}>
              {validateLabel}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  )
}
