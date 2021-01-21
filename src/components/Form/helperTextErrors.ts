import { FieldError } from 'react-hook-form/dist/types'
import { Texts } from '../../i18n/fr'

export function helperTextError(texts: Texts, error?: FieldError) {
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
