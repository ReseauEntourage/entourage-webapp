import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { useForm } from 'react-hook-form'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TextField, TextFieldPassword } from 'src/components/Form'
import { Modal } from 'src/components/Modal'
import { useOnLogin } from 'src/core/events'
import {
  selectStep,
  authUserActions,
  selectErrors,
  selectLoginIsCompleted,
} from 'src/core/useCases/authUser'
import { texts } from 'src/i18n'
import { useIsDesktop, variants } from 'src/styles'
import { useFirebase, useMount } from 'src/utils/hooks'
import * as S from './ModalSignin.styles'

type FormFields = {
  phone: string;
  password: string;
  SMSCode: string;
  passwordConfirmation: string;
}

interface ModalSignInProps {
  onSuccess?: () => void;
}

export function ModalSignIn(props: ModalSignInProps) {
  const { onSuccess } = props
  const dispatch = useDispatch()
  const step = useSelector(selectStep)
  const errors = useSelector(selectErrors)
  const closeOnNextRender = useSelector(selectLoginIsCompleted)
  const phoneForm = useForm<FormFields>()

  const isDesktop = useIsDesktop()

  const { sendEvent } = useFirebase()
  useMount(() => {
    sendEvent('View__LoginOrSignup__')
  })

  useEffect(() => {
    return () => {
      sendEvent('Action__LoginOrSignup__Cancel')
      dispatch(authUserActions.resetForm())
    }
  }, [dispatch, onSuccess, sendEvent])

  useOnLogin(() => {
    if (onSuccess) {
      onSuccess()
    }
  })

  const onValidate = () => {
    const { phone, password, SMSCode, passwordConfirmation } = phoneForm.getValues()

    if (step === 'PHONE') {
      sendEvent('Action__LoginOrSignup__ValidatePhone')
      dispatch(authUserActions.phoneLookUp(phone))
    } else if (step === 'CREATE_ACCOUNT') {
      sendEvent('Action__SignUp__CreateAccount')
      dispatch(authUserActions.createAccount(phone))
    } else if (step === 'PASSWORD') {
      sendEvent('Action__Login__Connection')
      dispatch(authUserActions.loginWithPassword({ phone, password }))
    } else if (step === 'SMS_CODE') {
      sendEvent('Action__SignUp__ValidateSMSCode')
      dispatch(authUserActions.loginWithSMSCode({ phone, SMSCode }))
    } else if (step === 'CREATE_PASSWORD') {
      sendEvent('Action__SignUp__ValidatePassword')
      dispatch(authUserActions.createPassword({ password, passwordConfirmation }))
    }

    return false
  }

  const resetPassword = () => {
    if (step === 'PASSWORD') {
      sendEvent('Action__Login__PasswordForgotten')
    } else {
      sendEvent('Action__SignUp__ResendSMSCode')
    }
    const { phone } = phoneForm.getValues()
    dispatch(authUserActions.resetPassword({ phone }))
  }

  const { buttonLabels, fieldLabels } = texts.content.modalLogin

  const validateLabel = (() => {
    switch (step) {
      case 'PHONE':
        return buttonLabels.validateNumber
      case 'CREATE_ACCOUNT':
        return buttonLabels.createAccount
      case 'SMS_CODE':
        return buttonLabels.validateSMSCode
      case 'CREATE_PASSWORD':
        return buttonLabels.validatePassword
      case 'PASSWORD':
        return buttonLabels.login
      case null:
        // do nothing, login is completed
        return ''
        break
      default:
        throw new Error('UNHANDLED')
    }
  })()

  const allowCancel = step !== 'CREATE_PASSWORD'
  const showAskCreateAccount = step === 'CREATE_ACCOUNT'
  const showPasswordField = step === 'PASSWORD'
  const showSMSCodeField = step === 'SMS_CODE' || step === 'CREATE_PASSWORD'
  const showForgottenPasswordLink = step === 'PASSWORD' || step === 'SMS_CODE'
  const showDefinePasswordFields = step === 'CREATE_PASSWORD'

  const passwordError = errors?.password === 'UNKNOWN_SERVER_ERROR'
    ? errors?.passwordUnknowServerError
    : errors?.password && texts.form[errors?.password]

  const passwordConfirmationError = errors?.passwordConfirmation === 'UNKNOWN_SERVER_ERROR'
    ? errors?.passwordUnknowServerError
    : errors?.passwordConfirmation && texts.form[errors?.passwordConfirmation]

  return (
    <Modal
      cancel={allowCancel}
      closeOnNextRender={closeOnNextRender}
      onValidate={onValidate}
      title={texts.content.modalLogin.title}
      validateLabel={validateLabel}
    >
      <Box style={{ paddingLeft: isDesktop ? 250 : 0 }}>
        {isDesktop && (
          <img
            alt="Personnage"
            src="/personnage-entourage-1.png"
            style={{
              position: 'absolute',
              left: 20,
              bottom: 0,
            }}
            width="200"
          />
        )}
        <TextField
          autoFocus={true}
          disabled={step !== 'PHONE'}
          errorText={errors?.phone && texts.form[errors?.phone]}
          fullWidth={true}
          inputRef={phoneForm.register}
          label={fieldLabels.phone}
          name="phone"
          type="text"
        />
        {showAskCreateAccount && (
          <Typography variant={variants.bodyRegular}>
            {texts.content.modalLogin.askAccountCreation}
          </Typography>
        )}
        {showPasswordField && (
          <TextFieldPassword
            autoFocus={true}
            disabled={step !== 'PASSWORD'}
            errorText={passwordError}
            fullWidth={true}
            inputRef={phoneForm.register}
            label={fieldLabels.enterYourPassword}
            name="password"
          />
        )}
        {showSMSCodeField && (
          <TextFieldPassword
            autoFocus={true}
            disabled={step !== 'SMS_CODE'}
            errorText={errors?.code && texts.form[errors?.code]}
            fullWidth={true}
            inputRef={phoneForm.register}
            label={fieldLabels.SMSCode}
            name="SMSCode"
          />
        )}
        {showForgottenPasswordLink && (
          <S.ForgottenPasswordLink onClick={resetPassword}>
            {step === 'PASSWORD' ? fieldLabels.passwordForgotten : fieldLabels.resendActivationCode}
          </S.ForgottenPasswordLink>
        )}
        {showDefinePasswordFields && (
          <>
            <TextFieldPassword
              autoFocus={true}
              errorText={passwordError}
              fullWidth={true}
              inputRef={phoneForm.register}
              label={fieldLabels.chooseYourPassword}
              name="password"
            />
            <TextFieldPassword
              errorText={passwordConfirmationError}
              fullWidth={true}
              inputRef={phoneForm.register}
              label={fieldLabels.confirmYourPassword}
              name="passwordConfirmation"
            />
          </>
        )}
      </Box>
    </Modal>
  )
}
