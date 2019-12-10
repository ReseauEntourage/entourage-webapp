import Typography from '@material-ui/core/Typography'
import cogoToast from 'cogo-toast'
import { FieldError } from 'react-hook-form/dist/types'
import React, { useEffect, useRef } from 'react'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'

type Errors = Partial<Record<string, FieldError>>

export function useCatchUnreadFormErrors<T extends Errors>(errors: T): T {
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

    cogoToast.error(
      // @ts-ignore
      <Typography variant={variants.bodyRegular}>
        {errorsMessages}
      </Typography>,
      { hideAfter: 5 },
    )
  }, [errors])

  // eslint-disable-next-line
  return new Proxy(errors, {
    get(obj, prop: string) {
      readErrors.current[prop] = true
      return obj[prop]
    },
  })
}
