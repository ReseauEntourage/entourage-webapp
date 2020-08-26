import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import useForm from 'react-hook-form'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { refetchQuery } from 'react-query'
import { TextField, validators } from 'src/components/Form'
import { Modal, openModal } from 'src/components/Modal'
import { ModalProfile } from 'src/containers/ModalProfile'
import { api } from 'src/core/api'
import { setTokenIntoCookies } from 'src/core/services'
import { queryKeys } from 'src/core/store'
import { texts } from 'src/i18n'
import { useIsDesktop } from 'src/styles'
import { handleServerError } from 'src/utils/misc'
import { AnyToFix } from 'src/utils/types'
import * as S from './ModalSignIn.styles'

type Step =
  | 'phone'
  | 'code-SMS'
  | 'password'
  | 'define-password'

type SetNextStep = (step: Step) => void
type PhoneForm = ReturnType<typeof useForm>
type SecretForm = ReturnType<typeof useForm>
type DefinePasswordForm = ReturnType<typeof useForm>

function usePhoneStep(setNextStep: SetNextStep) {
  const phoneForm = useForm<{ phone: string; }>()

  const onValidate = useCallback(async () => {
    if (!await phoneForm.triggerValidation()) {
      return false
    }

    const { phone } = phoneForm.getValues()

    try {
      const lookupResponse = await api.request({
        name: '/users/lookup POST',
        data: {
          phone,
        },
      })

      const lookupStatus = lookupResponse.data.status
      const lookupSecretType = lookupResponse.data.secretType

      if (lookupStatus === 'not_found') {
        await api.request({
          name: '/users POST',
          data: {
            user: {
              phone,
            },
          },
        })

        setNextStep('code-SMS')
      } else if (lookupStatus === 'found') {
        if (lookupSecretType === 'code') {
          setNextStep('code-SMS')
        } else {
          setNextStep('password')
        }
      } else {
        console.error('UNHANDLED')
      }

      return false
    } catch (error) {
      handleServerError(error, () => {
        const serverError = error.response && error.response.data && error.response.data && error.response.data.error
        if (serverError && serverError.code === 'INVALID_PHONE_FORMAT') {
          phoneForm.setError('phone', serverError.code, texts.form.BAD_FORMAT)
          return true
        }

        return false
      })

      return false
    }
  }, [phoneForm, setNextStep])

  return [phoneForm, onValidate] as [typeof phoneForm, typeof onValidate]
}

interface PhoneFieldProps {
  phoneForm: PhoneForm;
  step: Step;
}

function PhoneField(props: PhoneFieldProps) {
  const { phoneForm, step } = props

  return (
    <TextField
      autoFocus={true}
      disabled={step !== 'phone'}
      formErrors={phoneForm.errors}
      fullWidth={true}
      inputRef={phoneForm.register({
        required: true,
        validate: {
          phone: validators.phone,
        },
      })}
      label="Téléphone"
      name="phone"
      type="text"
    />
  )
}

function useSecretStep(setNextStep: SetNextStep, phoneForm: AnyToFix) {
  const secretForm = useForm<{ secret: string; }>()

  const onValidate = useCallback(async () => {
    if (!await secretForm.triggerValidation()) {
      return false
    }

    try {
      const loginResponse = await api.request({
        name: '/login POST',
        data: {
          user: {
            phone: phoneForm.getValues().phone,
            secret: secretForm.getValues().secret,
          },
        },
      })

      const { token, hasPassword } = loginResponse.data.user

      setTokenIntoCookies(token)
      refetchQuery(queryKeys.me, { force: true })

      if (!hasPassword) {
        setNextStep('define-password')
        return false
      }

      return true
    } catch (error) {
      handleServerError(error, () => {
        if (error.response.status === 401) {
          secretForm.setError('secret', '401', texts.form.INCORRECT_VALUE)
          return true
        }

        return false
      })

      return false
    }
  }, [phoneForm, secretForm, setNextStep])

  return [secretForm, onValidate] as [typeof secretForm, typeof onValidate]
}

interface SecretFieldProps {
  phoneForm: PhoneForm;
  resetPassword: () => void;
  secretForm: SecretForm;
  step: Step;
}

function SecretField(props: SecretFieldProps) {
  const { secretForm, step, resetPassword } = props
  const secretTypeRef = useRef<'password' | 'code-SMS'>()
  const secretTypeDone = secretTypeRef.current && step !== 'code-SMS' && step !== 'password'
  const secretTypeActive = step === 'code-SMS' || step === 'password'
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)

  useEffect(() => {
    if (step === 'password' || step === 'code-SMS') {
      secretTypeRef.current = step
    }
  }, [step])

  if (!secretTypeActive && !secretTypeDone) {
    return null
  }

  return (
    <>
      <TextField
        autoFocus={true}
        disabled={secretTypeDone}
        formErrors={secretForm.errors}
        fullWidth={true}
        InputProps={{ // <-- This is where the toggle button is added.
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputRef={secretForm.register({
          required: true,
        })}
        label={
          step === 'password'
            ? 'Entre votre mot de passe (au moins 8 caractères)'
            : 'Entrez le code d\'activation reçu'
        }
        name="secret"
        type={showPassword ? 'text' : 'password'}
      />
      {
        step === 'password'
        && <S.ForgottenPasswordLink onClick={resetPassword}>Mot de passe oublié ?</S.ForgottenPasswordLink>
      }
    </>
  )
}

function useDefinePasswordStep() {
  const definePasswordForm = useForm<{confirmationPassword: string; password: string; }>()

  const onValidate = useCallback(async () => {
    if (!await definePasswordForm.triggerValidation()) {
      return false
    }

    try {
      await api.request({
        name: '/users/me PATCH',
        data: {
          user: {
            password: definePasswordForm.getValues().password,
          },
        },
      })

      openModal(<ModalProfile />)

      return true
    } catch (error) {
      handleServerError(error, () => {
        if (error.response.status === 400) {
          definePasswordForm.setError('password', error.response.data.error.code, error.response.data.error.message)
          return true
        }

        return false
      })

      return false
    }
  }, [definePasswordForm])

  return [definePasswordForm, onValidate] as [typeof definePasswordForm, typeof onValidate]
}

interface DefinePasswordFieldProps {
  definePasswordForm: DefinePasswordForm;
  step: Step;
}

function DefinePasswordField(props: DefinePasswordFieldProps) {
  const { definePasswordForm, step } = props
  const stepDone = useRef<boolean>()

  useEffect(() => {
    if (step === 'define-password') {
      stepDone.current = true
    }
  }, [step])

  const showFields = step === 'define-password' || stepDone.current
  const stepPast = step !== 'define-password' && stepDone.current

  if (!showFields) {
    return null
  }

  return (
    <>
      <TextField
        autoFocus={true}
        disabled={stepPast}
        formErrors={definePasswordForm.errors}
        fullWidth={true}
        inputRef={definePasswordForm.register({
          required: true,
        })}
        label="Choisissez votre mot de passe"
        name="password"
        type="password"
      />
      <TextField
        disabled={stepPast}
        formErrors={definePasswordForm.errors}
        fullWidth={true}
        inputRef={definePasswordForm.register({
          required: true,
          validate: {
            confirmation: (confirmationPassword) => {
              return confirmationPassword !== definePasswordForm.getValues().password
                ? texts.form.INCORRECT_VALUE
                : true
            },
          },
        })}
        label="Confirmez votre mot de passe"
        name="confirmationPassword"
        type="password"
      />
    </>
  )
}

interface ModalSignInProps {
  onSuccess?: () => void;
}

export function ModalSignIn(props: ModalSignInProps) {
  const { onSuccess } = props
  const [step, setStep] = useState<Step>('phone')
  const [phoneForm, onValidatePhoneStep] = usePhoneStep(setStep)
  const [secretForm, onValidateSecretStep] = useSecretStep(setStep, phoneForm)
  const [definePasswordForm, onValidateDefinePasswordStep] = useDefinePasswordStep()
  const isDesktop = useIsDesktop()

  const onValidate = useCallback(async () => {
    if (step === 'phone') {
      return onValidatePhoneStep()
    } if (step === 'password' || step === 'code-SMS') {
      const isValid = await onValidateSecretStep()
      if (onSuccess && isValid) {
        onSuccess()
      }

      return isValid
    } if (step === 'define-password') {
      return onValidateDefinePasswordStep()
    }

    return false
  }, [
    onValidateDefinePasswordStep,
    onValidatePhoneStep,
    onValidateSecretStep,
    step,
    onSuccess,
  ])

  const resetPassword = React.useCallback(async () => {
    const { phone } = phoneForm.getValues()
    if (phone) {
      await api.request({
        name: '/users/me/code PATCH',
        data: {
          code: { action: 'regenerate' },
          user: { phone },
        },
      })
      setStep('code-SMS')
    }
  }, [phoneForm])

  const validateLabel = (() => {
    switch (step) {
      case 'phone':
        return 'Valider le numéro'
      case 'code-SMS':
        return 'Valider le code SMS'
      case 'define-password':
        return 'Valider le mot de passe'
      case 'password':
        return 'Connexion'
      default:
        throw new Error('UNHANDLED')
    }
  })()

  const allowCancel = step !== 'define-password'

  return (
    <Modal
      cancel={allowCancel}
      onValidate={onValidate}
      title="Connexion / Inscription"
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
        <PhoneField phoneForm={phoneForm} step={step} />
        <SecretField phoneForm={phoneForm} resetPassword={resetPassword} secretForm={secretForm} step={step} />
        <DefinePasswordField definePasswordForm={definePasswordForm} step={step} />
      </Box>
    </Modal>
  )
}
