import React, { useCallback, useState } from 'react'
import useForm from 'react-hook-form'
import { TextField, validators } from 'src/components/Form'
import { Modal } from 'src/components/Modal'
import { api, setTokenIntoCookies } from 'src/api'
import { handleServerError } from 'src/utils'
import { texts } from 'src/i18n'
import { AnyToFix } from 'src/types'

type Step =
  | 'phone'
  | 'user-not-found-code-SMS'
  | 'user-found-password'
  | 'user-found-code-SMS'

type SetStep = (step: Step) => void

function usePhoneStep(setStep: SetStep) {
  const formPhone = useForm<{ phone: string; }>()

  const onValidate = useCallback(async () => {
    if (!await formPhone.triggerValidation()) {
      return false
    }

    const { phone } = formPhone.getValues()

    try {
      const lookupResponse = await api.request({
        routeName: 'POST /users/lookup',
        data: {
          phone,
        },
      })

      const lookupStatus = lookupResponse.data.status
      const lookupSecretType = lookupResponse.data.secretType

      if (lookupStatus === 'not_found') {
        try {
          await api.request({
            routeName: 'POST users',
            data: {
              user: {
                phone,
              },
            },
          })

          setStep('user-not-found-code-SMS')
        } catch (error) {
          console.error('POST users', error)
          return false
        }
      } else if (lookupStatus === 'found') {
        if (lookupSecretType === 'code') {
          setStep('user-found-code-SMS')
        } else {
          setStep('user-found-password')
        }
      }

      return false
    } catch (error) {
      handleServerError(error, () => {
        const serverError = error.response && error.response.data && error.response.data && error.response.data.error
        if (serverError && serverError.code === 'INVALID_PHONE_FORMAT') {
          formPhone.setError('phone', serverError.code, texts.form.BAD_FORMAT)
          return true
        }

        return false
      })

      return false
    }
  }, [formPhone, setStep])

  return [formPhone, onValidate] as [typeof formPhone, typeof onValidate]
}

function useSecretStep(setStep: SetStep, formPhone: AnyToFix) {
  const formSecret = useForm<{ secret: string; }>()

  const onValidate = useCallback(async () => {
    if (!await formSecret.triggerValidation()) {
      return false
    }

    try {
      const loginResponse = await api.request({
        routeName: 'POST /login',
        data: {
          user: {
            phone: formPhone.getValues().phone,
            secret: formSecret.getValues().secret,
          },
        },
      })

      const { token } = loginResponse.data.user

      setTokenIntoCookies(token)

      return true
    } catch (error) {
      handleServerError(error, () => {
        if (error.response.status === 401) {
          formSecret.setError('secret', '401', texts.form.INCORRECT_VALUE)
          return true
        }

        return false
      })

      return false
    }
  }, [formPhone, formSecret])

  return [formSecret, onValidate] as [typeof formSecret, typeof onValidate]
}

export function SignInModal() {
  const [step, setStep] = useState<Step>('phone')
  const [formPhone, onValidatePhoneStep] = usePhoneStep(setStep)
  const [formSecret, onValidateSecretStep] = useSecretStep(setStep, formPhone)

  const onValidate = useCallback(async () => {
    if (step === 'phone') {
      return onValidatePhoneStep()
    }

    return onValidateSecretStep()
  }, [onValidatePhoneStep, onValidateSecretStep, step])

  const validateLabel = step === 'phone'
    ? 'Valider le numéro'
    : 'Valider le code'

  return (
    <Modal
      title="Envie de passer à l'action ? Super ! Rejoignez le réseau"
      onValidate={onValidate}
      validateLabel={validateLabel}
    >
      <TextField
        autoFocus={true}
        label="Téléphone"
        type="text"
        name="phone"
        fullWidth={true}
        inputRef={formPhone.register({
          required: true,
          validate: {
            phone: validators.phone,
          },
        })}
        formError={formPhone.errors.phone}
        disabled={step !== 'phone'}
      />
      {step === 'phone' ? null : (
        <TextField
          autoFocus={true}
          label={step === 'user-found-password' ? 'Mot de passe' : 'Code SMS'}
          type="text"
          name="secret"
          fullWidth={true}
          inputRef={formSecret.register({
            required: true,
          })}
          formError={formSecret.errors.secret}
          disabled={
            step !== 'user-found-code-SMS'
            && step !== 'user-found-password'
            && step !== 'user-not-found-code-SMS'
          }
        />
      )}
    </Modal>
  )
}
