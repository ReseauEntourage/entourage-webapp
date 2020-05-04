import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import React, { useCallback } from 'react'
import { Button } from 'src/components/Button'
import { colors, variants } from 'src/styles'
import { useDelayLoading } from 'src/utils/hooks'
import { AnyToFix } from 'src/utils/types'
import { useModalContext } from './ModalContext'

interface ModalProps {
  cancel?: boolean;
  cancelLabel?: string;
  children?: AnyToFix;
  onClose?: () => void;
  onValidate?: () => void | boolean | Promise<void | boolean>;
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
      <Typography component="div" variant={variants.bodyRegular}>
        {title && (
          <DialogTitle
            id="form-dialog-title"
            style={{
              backgroundColor: colors.main.primary,
              color: '#fff',
              textAlign: 'center',
            }}
          >
            {title}
          </DialogTitle>
        )}
        <Box m={2}>
          <DialogContent>
            {children}
          </DialogContent>
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
        </Box>
      </Typography>
    </Dialog>
  )
}
