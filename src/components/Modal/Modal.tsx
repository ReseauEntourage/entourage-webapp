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

interface ModalActionsProps extends BaseProps {
  actions: JSX.Element;
}

type ModalProps = BasicModalProps | ModalActionsProps

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
    onValidate,
    showCloseButton,
    closeOnNextRender,
    actions,
  } = { ...defaultProps, ...props }

  const { onClose } = useModalContext()

  useEffect(() => {
    if (closeOnNextRender && onClose) {
      onClose()
    }
  }, [closeOnNextRender, onClose])

  const hasCTAButtons = validate || cancel || actions

  return (
    <Dialog
      aria-labelledby="form-dialog-title"
      disableBackdropClick={true}
      disableEscapeKeyDown={!showCloseButton}
      onClose={onClose}
      open={true}
    >
      <S.GlobalStyle />
      {title ? (
        <DialogTitle
          id="form-dialog-title"
          style={{
            backgroundColor: colors.main.primary,
            color: colors.main.white,
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
          {actions || (
            <DefaultActions
              cancel={cancel}
              cancelLabel={cancelLabel}
              onClose={onClose}
              onValidate={onValidate}
              validate={validate}
              validateLabel={validateLabel}
            />
          )}
        </DialogActions>
      ) : null }
    </Dialog>
  )
}

interface DefaultActionsProps {
  onValidate?: () => void | boolean | Promise<void | boolean>;
  onClose?: () => void;
  cancel: boolean;
  cancelLabel: string;
  validate: boolean;
  validateLabel: string;
}

function DefaultActions(props: DefaultActionsProps) {
  const {
    validate,
    cancel,
    validateLabel,
    cancelLabel,
    onClose,
    onValidate: onValidateProp,
  } = props

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

  if (!validate && !cancel) {
    return null
  }

  return (
    <>
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
    </>
  )
}
