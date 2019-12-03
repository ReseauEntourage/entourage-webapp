import React, { useCallback } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { Button } from 'src/components/Button'
import { colors, variants } from 'src/styles'
import { AnyToFix } from 'src/types'
import { useModalContext } from './ModalContext'

interface Props {
  cancel?: boolean;
  cancelLabel?: string;
  children: AnyToFix;
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
    onClose: onCloseProp,
  } = { ...defaultProps, ...props }

  const modalContext = useModalContext()
  const onClose = modalContext ? modalContext.onClose : onCloseProp

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
      open={true}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      disableBackdropClick={true}
    >
      <Typography variant={variants.bodyRegular} component="div">
        <DialogTitle
          style={{
            backgroundColor: colors.main.primary,
            color: '#fff',
            textAlign: 'center',
          }}
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
      </Typography>
    </Dialog>
  )
}
