import { texts } from 'src/i18n'
import { FieldError } from 'react-hook-form/dist/types'

export function helperTextError(error?: FieldError) {
  if (!error) {
    return null
  }

  if (error.type === 'required') {
    return texts.form.FIELD_REQUIRED
  }

  if (error.message) {
    return error.message
  }

  console.error(error)
  throw new Error('Error field not handled')
}
