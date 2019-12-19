import Box from '@material-ui/core/Box'
import useForm from 'react-hook-form'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { refetchQuery } from 'react-query'
import { TextField, validators } from 'src/components/Form'
import { Modal, openModal } from 'src/components/Modal'
import { ModalProfile } from 'src/containers/ModalProfile'
import { texts } from 'src/i18n'
import { api } from 'src/network/api'
import { queryKeys } from 'src/network/queries'
import { setTokenIntoCookies } from 'src/network/services'
import { AnyToFix } from 'src/types'
import { handleServerError } from 'src/utils'

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
        name: 'POST /users/lookup',
        data: {
          phone,
        },
      })

      const lookupStatus = lookupResponse.data.status
      const lookupSecretType = lookupResponse.data.secretType

      if (lookupStatus === 'not_found') {
        await api.request({
          name: 'POST /users',
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
        name: 'POST /login',
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
  secretForm: SecretForm;
  step: Step;
}

function SecretField(props: SecretFieldProps) {
  const { secretForm, step } = props
  const secretTypeRef = useRef<'password' | 'code-SMS'>()
  const secretTypeDone = secretTypeRef.current && step !== 'code-SMS' && step !== 'password'
  const secretTypeActive = step === 'code-SMS' || step === 'password'

  useEffect(() => {
    if (step === 'password' || step === 'code-SMS') {
      secretTypeRef.current = step
    }
  }, [step])

  if (!secretTypeActive && !secretTypeDone) {
    return null
  }

  return (
    <TextField
      autoFocus={true}
      disabled={secretTypeDone}
      formErrors={secretForm.errors}
      fullWidth={true}
      inputRef={secretForm.register({
        required: true,
      })}
      label={
        step === 'password'
          ? 'Entre votre mot de passe (au moins 8 caractères)'
          : 'Entrez le code d\'activation reçu'
      }
      name="secret"
      type="password"
    />
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
        name: 'PATCH /users/me',
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

export function ModalSignIn() {
  const [step, setStep] = useState<Step>('phone')
  const [phoneForm, onValidatePhoneStep] = usePhoneStep(setStep)
  const [secretForm, onValidateSecretStep] = useSecretStep(setStep, phoneForm)
  const [definePasswordForm, onValidateDefinePasswordStep] = useDefinePasswordStep()

  const onValidate = useCallback(() => {
    if (step === 'phone') {
      return onValidatePhoneStep()
    } if (step === 'password' || step === 'code-SMS') {
      return onValidateSecretStep()
    } if (step === 'define-password') {
      return onValidateDefinePasswordStep()
    }

    return false
  }, [onValidateDefinePasswordStep, onValidatePhoneStep, onValidateSecretStep, step])

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

  return (
    <Modal
      onValidate={onValidate}
      title="Connexion / Inscription"
      validateLabel={validateLabel}
    >
      <Box style={{ paddingLeft: 250 }}>
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
        <PhoneField phoneForm={phoneForm} step={step} />
        <SecretField phoneForm={phoneForm} secretForm={secretForm} step={step} />
        <DefinePasswordField definePasswordForm={definePasswordForm} step={step} />
      </Box>
    </Modal>
  )
}
