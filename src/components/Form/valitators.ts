import validator from 'validator'
import { l18n } from 'src/i18n'

export const validators = {
  email: (value: string) => {
    return !validator.isEmail(value) ? l18n().form.EMAIL_REQUIRED : true
  },
  phone: (value: string) => {
    return !validator.isMobilePhone(value) ? l18n().form.BAD_FORMAT : true
  },
}
