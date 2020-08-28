import useForm from 'react-hook-form'
import { useCallback } from 'react'
import { refetchQuery } from 'react-query'
import { SetNextStep } from '../ModalSignIn'
import { api } from 'src/core/api'
import { setTokenIntoCookies } from 'src/core/services'
import { queryKeys } from 'src/core/store'
import { texts } from 'src/i18n'
import { handleServerError } from 'src/utils/misc'
import { AnyToFix } from 'src/utils/types'

export function useSecretStep(setNextStep: SetNextStep, phoneForm: AnyToFix) {
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
