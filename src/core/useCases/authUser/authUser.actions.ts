import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { AuthUserState } from './authUser.reducer'

export const ActionType = {
  PHONE_LOOK_UP: 'AUTH/PHONE_LOOK_UP',
  CREATE_ACCOUNT: 'AUTH/CREATE_ACCOUNT',
  CREATE_ACCOUNT_SUCCEEDED: 'AUTH/CREATE_ACCOUNT_SUCCEEDED',
  ASK_SMS_CODE: 'AUTH/ASK_SMS_CODE',
  ASK_PASSWORD: 'AUTH/ASK_PASSWORD',
  LOGIN_WITH_PASSWORD: 'AUTH/LOGIN_WITH_PASSWORD',
  LOGIN_WITH_PASSWORD_SUCCEEDED: 'AUTH/LOGIN_WITH_PASSWORD_SUCCEEDED',
  LOGIN_WITH_SMS_CODE: 'AUTH/LOGIN_WITH_SMS_CODE',
  LOGIN_WITH_SMS_CODE_SUCCEEDED: 'AUTH/LOGIN_WITH_SMS_CODE_SUCCEEDED',
  CREATE_PASSWORD: 'AUTH/CREATE_PASSWORD',
  CREATE_PASSWORD_SUCCEEDED: 'AUTH/CREATE_PASSWORD_SUCCEEDED',
  RESET_PASSWORD: 'AUTH/RESET_PASSWORD',
  RESET_PASSWORD_SUCCEEDED: 'AUTH/RESET_PASSWORD_SUCCEEDED',
  SET_ERRORS: 'AUTH/SET_ERRORS',
  RESET_FORM: 'AUTH/RESET_FORM',
  SET_USER: 'AUTH/SET_USER',
} as const

export type ActionType = keyof typeof ActionType;

function phoneLookUp(phone: string) {
  return {
    type: ActionType.PHONE_LOOK_UP,
    payload: {
      phone,
    },
  }
}

function createAccount(phone: string) {
  return {
    type: ActionType.CREATE_ACCOUNT,
    payload: {
      phone,
    },
  }
}

function createAccountSuccess() {
  return {
    type: ActionType.CREATE_ACCOUNT_SUCCEEDED,
  }
}

function askSMSCode() {
  return {
    type: ActionType.ASK_SMS_CODE,
  }
}

function askPassword() {
  return {
    type: ActionType.ASK_PASSWORD,
  }
}

function loginWithPassword(payload: { phone: string; password: string; }) {
  return {
    type: ActionType.LOGIN_WITH_PASSWORD,
    payload,
  }
}

function loginWithPasswordSuccess(payload: { user: AuthUserState['user']; }) {
  return {
    type: ActionType.LOGIN_WITH_PASSWORD_SUCCEEDED,
    payload,
  }
}

function loginWithSMSCode(payload: { phone: string; SMSCode: string; }) {
  return {
    type: ActionType.LOGIN_WITH_SMS_CODE,
    payload,
  }
}

function loginWithSMSCodeSuccess(payload: { user: AuthUserState['user']; }) {
  return {
    type: ActionType.LOGIN_WITH_SMS_CODE_SUCCEEDED,
    payload,
  }
}

function createPassword(payload: { password: string; passwordConfirmation: string; }) {
  return {
    type: ActionType.CREATE_PASSWORD,
    payload,
  }
}

function createPasswordSuccess() {
  return {
    type: ActionType.CREATE_PASSWORD_SUCCEEDED,
  }
}

function resetPassword(payload: { phone: string; }) {
  return {
    type: ActionType.RESET_PASSWORD,
    payload,
  }
}

function resetPasswordSuccess() {
  return {
    type: ActionType.RESET_PASSWORD_SUCCEEDED,
  }
}

function setErrors(payload: AuthUserState['errors']) {
  return {
    type: ActionType.SET_ERRORS,
    payload,
  }
}

function resetForm() {
  return {
    type: ActionType.RESET_FORM,
  }
}

function setUser(payload: AuthUserState['user']) {
  return {
    type: ActionType.SET_USER,
    payload,
  }
}

// ------------------------------------------------------------------------

export const publicActions = {
  phoneLookUp,
  createAccount,
  askSMSCode,
  askPassword,
  loginWithPassword,
  loginWithSMSCode,
  createPassword,
  resetPassword,
  resetForm,
  setUser,
}

const privateActions = {
  createAccountSuccess,
  loginWithSMSCodeSuccess,
  createPasswordSuccess,
  resetPasswordSuccess,
  loginWithPasswordSuccess,
  setErrors,
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type Actions = ActionsFromMapObject<typeof actions>
export type Action = ActionFromMapObject<typeof actions>;
