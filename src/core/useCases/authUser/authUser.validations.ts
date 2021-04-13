// ----------------------------------------------------------------
//                            Phone
// ----------------------------------------------------------------
export const PhoneValidationsError = {
  REQUIRED: 'REQUIRED',
  INVALID_FORMAT: 'INVALID_FORMAT',
} as const

export type PhoneValidationsError = keyof typeof PhoneValidationsError

// ----------------------------------------------------------------
//                            Password
// ----------------------------------------------------------------
export const PasswordValidationsError = {
  REQUIRED: 'REQUIRED',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  UNKNOWN_SERVER_ERROR: 'UNKNOWN_SERVER_ERROR',
} as const

export type PasswordValidationsError = keyof typeof PasswordValidationsError

// ----------------------------------------------------------------
//                    Password confirmation
// ----------------------------------------------------------------
export const PasswordConfirmationValidationsError = {
  REQUIRED: 'REQUIRED',
  PASSWORD_CONFIRMATION_NOT_MATCH: 'PASSWORD_CONFIRMATION_NOT_MATCH',
  UNKNOWN_SERVER_ERROR: 'UNKNOWN_SERVER_ERROR',
} as const

export type PasswordConfirmationValidationsError = keyof typeof PasswordConfirmationValidationsError

// ----------------------------------------------------------------
//                          SMS Code
// ----------------------------------------------------------------
export const SMSCodeValidationsError = {
  REQUIRED: 'REQUIRED',
  INVALID_SMS_CODE: 'INVALID_SMS_CODE',
} as const

export type SMSCodeValidationsError = keyof typeof SMSCodeValidationsError

// ----------------------------------------------------------------
// ----------------------------------------------------------------

export function validatePhone(phone: string) {
  if (!phone) {
    return PhoneValidationsError.REQUIRED
  }

  if (!phone.match(/^((\+)33|0)[1-9](\d{2}){4}$/)) {
    return PhoneValidationsError.INVALID_FORMAT
  }

  return null
}

export function validatePassword(password: string) {
  if (!password) {
    return PasswordValidationsError.REQUIRED
  }

  return null
}

export function validateSMSCode(SMSCode: string) {
  if (!SMSCode) {
    return SMSCodeValidationsError.REQUIRED
  }

  return null
}

export function validatePasswordCreation(password: string) {
  if (!password) {
    return PasswordValidationsError.REQUIRED
  }

  if (password.length < 8) {
    return PasswordValidationsError.PASSWORD_TOO_SHORT
  }

  return null
}

export function validatePasswordConfirmation(password: string, passwordConfirmation: string) {
  if (!passwordConfirmation) {
    return PasswordConfirmationValidationsError.REQUIRED
  }

  if (password !== passwordConfirmation) {
    return PasswordConfirmationValidationsError.PASSWORD_CONFIRMATION_NOT_MATCH
  }

  return null
}
