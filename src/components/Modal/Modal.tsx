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
import { AnyToFix, StrictUnion } from 'src/utils/types'
import * as S from './Modal.styles'
import { useModalContext } from './ModalContext'

interface DefaultActionsProps {
  onValidate?: () => void | boolean | Promise<void | boolean>;
  onClose?: () => void;
  mustWaiting?: boolean;
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
    mustWaiting,
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
        <Button
          color="primary"
          onClick={onClose}
          tabIndex={-1}
          variant="outlined"
        >
          {cancelLabel}
        </Button>
      )}
      {validate && (
        <Button
          color="primary"
          loading={mustWaiting || loading}
          onClick={onValidate}
        >
          {validateLabel}
        </Button>
      )}
    </>
  )
}

interface BaseProps {
  children?: AnyToFix;
  onValidate?: () => void | boolean | Promise<void | boolean>;
  showCloseButton?: boolean;
  title?: string;
  closeOnNextRender?: boolean;
}

interface BasicModalProps extends BaseProps {
  cancel?: boolean;
  cancelLabel?: string;
  validate?: boolean;
  validateLabel?: string;
  mustWaiting?: boolean;
}

interface ModalActionsProps extends BaseProps {
  actions: JSX.Element;
}

type ModalProps = StrictUnion<BasicModalProps | ModalActionsProps>;

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
    mustWaiting,
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
      disableEscapeKeyDown={!showCloseButton}
      onClose={(event: Record<string, unknown>, reason) => {
        if (reason === 'backdropClick') {
          return
        }
        onClose()
      }}
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
        showCloseButton && (
          <S.CloseIconContainer aria-label="close" onClick={onClose}>
            <CloseIcon color="primary" />
          </S.CloseIconContainer>
        )
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
              mustWaiting={mustWaiting}
              onClose={onClose}
              onValidate={onValidate}
              validate={validate}
              validateLabel={validateLabel}
            />
          )}
        </DialogActions>
      ) : null}
    </Dialog>
  )
}
