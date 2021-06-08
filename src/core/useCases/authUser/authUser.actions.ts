import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { AuthUserState } from './authUser.reducer'

export const AuthUserActionType = {
  PHONE_LOOK_UP: 'AUTH/PHONE_LOOK_UP',
  CREATE_ACCOUNT: 'AUTH/CREATE_ACCOUNT',
  CREATE_ACCOUNT_SUCCEEDED: 'AUTH/CREATE_ACCOUNT_SUCCEEDED',
  ASK_CREATE_ACCOUNT: 'AUTH/ASK_CREATE_ACCOUNT',
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
  INIT_USER: 'AUTH/INIT_USER',
  SET_USER: 'AUTH/SET_USER',
  SHOW_SENSITIZATION_POPUP: 'AUTH/SHOW_SENSITIZATION_POPUP',
  HIDE_SENSITIZATION_POPUP: 'AUTH/HIDE_SENSITIZATION_POPUP',
  UPDATE_USER: 'AUTH/UPDATE_USER',
  UPDATE_USER_SUCCEEDED: 'AUTH/UPDATE_USER_SUCCEEDED',
  LOGOUT: 'AUTH/LOGOUT',
} as const

export type AuthUserActionType = keyof typeof AuthUserActionType;

function phoneLookUp(phone: string) {
  return {
    type: AuthUserActionType.PHONE_LOOK_UP,
    payload: {
      phone,
    },
  }
}

function createAccount(phone: string) {
  return {
    type: AuthUserActionType.CREATE_ACCOUNT,
    payload: {
      phone,
    },
  }
}

function createAccountSuccess() {
  return {
    type: AuthUserActionType.CREATE_ACCOUNT_SUCCEEDED,
  }
}

function askCreateAccount() {
  return {
    type: AuthUserActionType.ASK_CREATE_ACCOUNT,
  }
}

function askSMSCode() {
  return {
    type: AuthUserActionType.ASK_SMS_CODE,
  }
}

function askPassword() {
  return {
    type: AuthUserActionType.ASK_PASSWORD,
  }
}

function loginWithPassword(payload: { phone: string; password: string; }) {
  return {
    type: AuthUserActionType.LOGIN_WITH_PASSWORD,
    payload,
  }
}

function loginWithPasswordSuccess(payload: { user: AuthUserState['user']; }) {
  return {
    type: AuthUserActionType.LOGIN_WITH_PASSWORD_SUCCEEDED,
    payload,
  }
}

function loginWithSMSCode(payload: { phone: string; SMSCode: string; }) {
  return {
    type: AuthUserActionType.LOGIN_WITH_SMS_CODE,
    payload,
  }
}

function loginWithSMSCodeSuccess(payload: { user: AuthUserState['user']; }) {
  return {
    type: AuthUserActionType.LOGIN_WITH_SMS_CODE_SUCCEEDED,
    payload,
  }
}

function createPassword(payload: { password: string; passwordConfirmation: string; }) {
  return {
    type: AuthUserActionType.CREATE_PASSWORD,
    payload,
  }
}

function createPasswordSuccess() {
  return {
    type: AuthUserActionType.CREATE_PASSWORD_SUCCEEDED,
  }
}

function resetPassword(payload: { phone: string; }) {
  return {
    type: AuthUserActionType.RESET_PASSWORD,
    payload,
  }
}

function resetPasswordSuccess() {
  return {
    type: AuthUserActionType.RESET_PASSWORD_SUCCEEDED,
  }
}

function setErrors(payload: AuthUserState['errors']) {
  return {
    type: AuthUserActionType.SET_ERRORS,
    payload,
  }
}

function resetForm() {
  return {
    type: AuthUserActionType.RESET_FORM,
  }
}

function initUser() {
  return {
    type: AuthUserActionType.INIT_USER,
  }
}

function setUser(payload: AuthUserState['user']) {
  return {
    type: AuthUserActionType.SET_USER,
    payload,
  }
}

function hideSensitizationPopup() {
  return {
    type: AuthUserActionType.HIDE_SENSITIZATION_POPUP,
  }
}

function setShowSensitizationPopup(payload: AuthUserState['showSensitizationPopup']) {
  return {
    type: AuthUserActionType.SHOW_SENSITIZATION_POPUP,
    payload,
  }
}

function updateUser(payload: {
  about?: string;
  avatarKey?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  address?: {
    googlePlaceId: string;
    googleSessionToken: google.maps.places.AutocompleteSessionToken;
  };
}) {
  return {
    type: AuthUserActionType.UPDATE_USER,
    payload,
  }
}

function updateUserSuccess(payload: { user: NonNullable<AuthUserState['user']>; }) {
  return {
    type: AuthUserActionType.UPDATE_USER_SUCCEEDED,
    payload,
  }
}

function logout() {
  return {
    type: AuthUserActionType.LOGOUT,
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
  initUser,
  setUser,
  hideSensitizationPopup,
  updateUser,
  logout,
}

const privateActions = {
  askCreateAccount,
  createAccountSuccess,
  loginWithSMSCodeSuccess,
  createPasswordSuccess,
  resetPasswordSuccess,
  loginWithPasswordSuccess,
  setErrors,
  setShowSensitizationPopup,
  updateUserSuccess,
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type AuthUserActions = ActionsFromMapObject<typeof actions>
export type AuthUserAction = ActionFromMapObject<typeof actions>
