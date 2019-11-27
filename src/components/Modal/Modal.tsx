import React, { useCallback } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Box from '@material-ui/core/Box'
import { Button } from 'src/components/Button'
import { colors } from 'src/styles'
import { AnyToFix } from 'src/types'
import { useModalTriggerContext } from './ModalTrigger'

interface Props {
  cancel?: boolean;
  cancelLabel?: string;
  children: AnyToFix;
  open?: boolean;
  onClose?: () => void;
  onValidate?: () => void | boolean | Promise<void | boolean>;
  title: string;
  validate?: boolean;
  validateLabel?: string;
}

const defaultProps = {
  validateLabel: 'Valider',
  cancelLabel: 'Annuler',
  validate: true,
  cancel: true,
}

export function Modal(props: Props) {
  const {
    title,
    children,
    validate,
    cancel,
    validateLabel,
    cancelLabel,
    onValidate: onValidateProp,
    open: openProp,
    onClose: onCloseProp,
  } = { ...defaultProps, ...props }

  const modalTriggerContext = useModalTriggerContext()
  const onClose = modalTriggerContext ? modalTriggerContext.onClose : onCloseProp
  const open = modalTriggerContext ? modalTriggerContext.open : openProp

  const onValidate = useCallback(async () => {
    if (onValidateProp) {
      const onValidateRes = await onValidateProp()
      if (onValidateRes === false) {
        return
      }
    }

    if (onClose) {
      onClose()
    }
  }, [onClose, onValidateProp])

  const hasCTAButtons = validate || cancel

  return (
    <Dialog
      open={open || false}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      disableBackdropClick={true}
    >
      <DialogTitle
        style={{ backgroundColor: colors.main.primary, color: '#fff' }}
        id="form-dialog-title"
      >
        {title}
      </DialogTitle>
      <Box m={2}>
        <DialogContent>
          {children}
        </DialogContent>
        {hasCTAButtons && (
          <DialogActions>
            {cancel && (
              <Button onClick={onClose} color="primary" variant="outlined" tabIndex={-1}>
                {cancelLabel}
              </Button>
            )}
            {validate && (
              <Button color="primary" onClick={onValidate}>
                {validateLabel}
              </Button>
            )}
          </DialogActions>
        )}
      </Box>
    </Dialog>
  )
}
