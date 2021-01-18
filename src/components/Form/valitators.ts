import validator from 'validator'
import { Texts } from '../../i18n/fr'

export const validators = {
  email: (value: string, texts: Texts) => {
    return !validator.isEmail(value) ? texts.form.EMAIL_REQUIRED : true
  },
  phone: (value: string, texts: Texts) => {
    return !validator.isMobilePhone(value) ? texts.form.BAD_FORMAT : true
  },
}
