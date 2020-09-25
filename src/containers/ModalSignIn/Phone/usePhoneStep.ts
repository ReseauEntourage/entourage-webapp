import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import { SetNextStep } from '../ModalSignIn'
import { api } from 'src/core/api'
import { texts } from 'src/i18n'
import { handleServerError } from 'src/utils/misc'

export function usePhoneStep(setNextStep: SetNextStep) {
  const phoneForm = useForm<{ phone: string; }>()

  const onValidate = useCallback(async () => {
    if (!(await phoneForm.trigger())) {
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
        const serverError = error.response
          && error.response.data
          && error.response.data
          && error.response.data.error
        if (serverError && serverError.code === 'INVALID_PHONE_FORMAT') {
          phoneForm.setError('phone', {
            type: serverError.code,
            message: texts.form.BAD_FORMAT,
          })
          return true
        }

        return false
      })

      return false
    }
  }, [phoneForm, setNextStep])

  return { phoneForm, onValidate }
}
