import { useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { notificationsActions } from 'src/core/useCases/notifications'
import { texts } from 'src/i18n'

type Errors = ReturnType<typeof useForm>['errors']

export function useCatchUnreadFormErrors<T extends Errors>(errors: T): T {
  const dispatch = useDispatch()
  const readErrors = useRef<{ [key: string]: boolean; }>({})
  readErrors.current = {}

  useEffect(() => {
    const keyUnhandled = Object.keys(errors).filter((key) => !readErrors.current[key])

    if (!keyUnhandled.length) return

    const errorsMessages = keyUnhandled.map((key) => {
      const error = errors[key]
      if (!error) return ''

      let message = error && error.message

      if (!message) {
        if (error.type === 'required') {
          message = `${key}: ${texts.form.FIELD_REQUIRED}`
        } else {
          throw new Error('Unhandle')
        }
      }

      return message
    }).join('\n')

    for (let i = 0; i < errorsMessages.length; i += 1) {
      dispatch(notificationsActions.addAlert({ message: errorsMessages[i], severity: 'error' }))
    }
  }, [dispatch, errors])

  // eslint-disable-next-line
  return new Proxy(errors, {
    get(obj, prop: string) {
      readErrors.current[prop] = true
      return obj[prop]
    },
  })
}
