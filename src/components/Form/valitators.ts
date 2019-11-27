import validator from 'validator'
import { texts } from 'src/i18n'

export const validators = {
  email: (value: string) => {
    return !validator.isEmail(value) ? texts.form.EMAIL_REQUIRED : true
  },
  phone: (value: string) => {
    return !validator.isMobilePhone(value) ? texts.form.BAD_FORMAT : true
  },
}
