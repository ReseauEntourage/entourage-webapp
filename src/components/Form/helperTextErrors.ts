import { FieldError } from 'react-hook-form/dist/types'
import { l18n } from 'src/i18n'

export function helperTextError(error?: FieldError) {
  if (!error) {
    return null
  }

  if (error.type === 'required') {
    return l18n().form.FIELD_REQUIRED
  }

  if (error.message) {
    return error.message
  }

  console.error(error)
  throw new Error('Error field not handled')
}
