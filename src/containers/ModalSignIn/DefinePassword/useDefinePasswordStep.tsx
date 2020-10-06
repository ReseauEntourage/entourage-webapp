import { useForm } from 'react-hook-form'
import React, { useCallback } from 'react'
import { openModal } from 'src/components/Modal'
import { ModalProfile } from 'src/containers/ModalProfile'
import { api } from 'src/core/api'
import { useQueryGetUserInfosAreIncompleted } from 'src/core/store'
import { handleServerError } from 'src/utils/misc'

export function useDefinePasswordStep() {
  const definePasswordForm = useForm<{confirmationPassword: string; password: string; }>()
  const getUserInfosAreIncompleted = useQueryGetUserInfosAreIncompleted()

  const onValidate = useCallback(async () => {
    if (!await definePasswordForm.trigger()) {
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

      if (getUserInfosAreIncompleted()) {
        openModal(<ModalProfile />)
      }

      return true
    } catch (error) {
      handleServerError(error, () => {
        if (error.response.status === 400) {
          definePasswordForm.setError('password',
            {
              type: error.response.data.error.code,
              message: error.response.data.error.message,
            })
          return true
        }

        return false
      })

      return false
    }
  }, [definePasswordForm, getUserInfosAreIncompleted])

  return { definePasswordForm, onValidate }
}
