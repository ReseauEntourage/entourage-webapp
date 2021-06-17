import validator from 'validator'
import { texts } from 'src/i18n'

export const validators = {
  firstName: (value: string) => {
    return !value.trim() ? texts.form.FIELD_REQUIRED : true
  },
  lastName: (value: string) => {
    return !value.trim() ? texts.form.FIELD_REQUIRED : true
  },
  email: (value: string) => {
    return !validator.isEmail(value) ? texts.form.EMAIL_REQUIRED : true
  },
  phone: (value: string) => {
    return !validator.isMobilePhone(value) ? texts.form.BAD_FORMAT : true
  },
}
