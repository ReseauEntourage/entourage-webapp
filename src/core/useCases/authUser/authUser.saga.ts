import { call, put, getContext, select } from 'redux-saga/effects'
import { CallReturnType } from '../../utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { PhoneLookUpResponse, IAuthUserGateway } from './IAuthUserGateway'
import { IAuthUserSensitizationStorage } from './IAuthUserSensitizationStorage'
import { IAuthUserTokenStorage } from './IAuthUserTokenStorage'
import { ActionType, actions, Actions } from './authUser.actions'
import { AuthUserErrorUnauthorized, AuthUserErrorUnkownPasswordError } from './authUser.errors'
import { selectUser } from './authUser.selectors'
import {
  validatePhone,
  validatePassword,
  validatePasswordConfirmation,
  validatePasswordCreation,
  PasswordValidationsError,
  validateSMSCode,
  SMSCodeValidationsError,
} from './authUser.validations'

export interface Dependencies {
  authUserGateway: IAuthUserGateway;
  authUserTokenStorage: IAuthUserTokenStorage;
  authUserSensitizationStorage: IAuthUserSensitizationStorage;
}

function* showSensitizationPopupSaga() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { authUserSensitizationStorage } = dependencies
  const user = yield select(selectUser)

  if (user) {
    const hasSeenSensitizationPopup = authUserSensitizationStorage.getHasSeenPopup(user.id)

    const { entourageCount, actionsCount, eventsCount } = user.stats

    const userIsActive = entourageCount + actionsCount + eventsCount > 0

    if (userIsActive) {
      authUserSensitizationStorage.setHasSeenPopup(user.id)
    }

    const showSensitizationPopup = (!userIsActive && !hasSeenSensitizationPopup) || user.firstSignIn

    yield put(actions.setShowSensitizationPopup(showSensitizationPopup))
  } else {
    yield put(actions.setShowSensitizationPopup(false))
  }
}

function* hideSensitizationPopupSaga() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { authUserSensitizationStorage } = dependencies
  const user = yield select(selectUser)
  authUserSensitizationStorage.setHasSeenPopup(user.id)
}

function* phoneLookUpSaga(action: Actions['phoneLookUp']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { phoneLookUp } = dependencies.authUserGateway
  const { phone } = action.payload

  const phoneError = validatePhone(phone)

  if (phoneError) {
    yield put(actions.setErrors({ phone: phoneError }))
    return
  }

  yield put(actions.setErrors({}))

  const phoneLookuResponse: CallReturnType<typeof phoneLookUp> = yield call(phoneLookUp, { phone })
  if (phoneLookuResponse === PhoneLookUpResponse.PHONE_NOT_FOUND) {
    yield put(actions.askCreateAccount())
  } else if (phoneLookuResponse === PhoneLookUpResponse.SMS_CODE_NEEDED) {
    yield put(actions.askSMSCode())
  } else if (phoneLookuResponse === PhoneLookUpResponse.PASSWORD_NEEDED) {
    yield put(actions.askPassword())
  }
}

function* createAccountSaga(action: Actions['createAccount']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { createAccount: createAccountGateway } = dependencies.authUserGateway
  const { phone } = action.payload

  yield call(createAccountGateway, { phone })
  yield put(actions.createAccountSuccess())
}

function* loginWithPasswordSaga(action: Actions['loginWithPassword']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { authUserGateway, authUserTokenStorage } = dependencies
  const { phone, password } = action.payload

  const passwordError = validatePassword(password)

  if (passwordError) {
    yield put(actions.setErrors({
      password: passwordError,
    }))
    return
  }
  try {
    type Response = CallReturnType<typeof authUserGateway.loginWithPassword>
    const response: Response = yield call(authUserGateway.loginWithPassword, { phone, password })
    authUserTokenStorage.setToken(response.token)

    yield put(actions.loginWithPasswordSuccess({ user: response }))
  } catch (error) {
    if (error instanceof AuthUserErrorUnauthorized) {
      yield put(actions.setErrors({
        password: PasswordValidationsError.INVALID_PASSWORD,
      }))
      return
    }

    throw error
  }
}

function* loginWithSMSCodeSaga(action: Actions['loginWithSMSCode']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { authUserGateway, authUserTokenStorage } = dependencies
  const { phone, SMSCode } = action.payload

  const SMSCodeError = validateSMSCode(SMSCode)

  if (SMSCodeError) {
    yield put(actions.setErrors({
      code: SMSCodeError,
    }))
    return
  }

  try {
    type Response = CallReturnType<typeof authUserGateway.loginWithSMSCode>
    const response: Response = yield call(authUserGateway.loginWithSMSCode, { phone, SMSCode })
    authUserTokenStorage.setToken(response.token)

    yield put(actions.loginWithSMSCodeSuccess({ user: response }))
  } catch (error) {
    if (error instanceof AuthUserErrorUnauthorized) {
      yield put(actions.setErrors({
        code: SMSCodeValidationsError.INVALID_SMS_CODE,
      }))
      return
    }

    throw error
  }
}

function* createPasswordSaga(action: Actions['createPassword']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { authUserGateway } = dependencies
  const { password, passwordConfirmation } = action.payload

  const passwordError = validatePasswordCreation(password)
  const passwordConfirmationError = validatePasswordConfirmation(password, passwordConfirmation)

  if (passwordError || passwordConfirmationError) {
    yield put(actions.setErrors({
      password: passwordError ?? undefined,
      passwordConfirmation: passwordConfirmationError ?? undefined,
    }))
    return
  }

  yield put(actions.setErrors({}))

  try {
    yield call(authUserGateway.definePassword, { password, passwordConfirmation })
    yield put(actions.createPasswordSuccess())
  } catch (error) {
    if (error instanceof AuthUserErrorUnkownPasswordError) {
      yield put(actions.setErrors({
        password: PasswordValidationsError.UNKNOWN_SERVER_ERROR,
        passwordUnknowServerError: error.message.toString(),
      }))
      return
    }

    throw error
  }
}

function* resetPasswordSaga(action: Actions['resetPassword']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { authUserGateway } = dependencies
  const { phone } = action.payload

  const phoneError = validatePhone(phone)

  if (phoneError) {
    yield put(actions.setErrors({ phone: phoneError }))
    return
  }

  yield put(actions.setErrors({}))

  yield call(authUserGateway.resetPassword, { phone })
  yield put(actions.resetPasswordSuccess())
}

export function* authUserSaga() {
  yield takeEvery(ActionType.PHONE_LOOK_UP, phoneLookUpSaga)
  yield takeEvery(ActionType.CREATE_ACCOUNT, createAccountSaga)
  yield takeEvery(ActionType.LOGIN_WITH_PASSWORD, loginWithPasswordSaga)
  yield takeEvery(ActionType.LOGIN_WITH_SMS_CODE, loginWithSMSCodeSaga)
  yield takeEvery(ActionType.LOGIN_WITH_PASSWORD_SUCCEEDED, showSensitizationPopupSaga)
  yield takeEvery(ActionType.CREATE_PASSWORD_SUCCEEDED, showSensitizationPopupSaga)
  yield takeEvery(ActionType.CREATE_PASSWORD, createPasswordSaga)
  yield takeEvery(ActionType.RESET_PASSWORD, resetPasswordSaga)
  yield takeEvery(ActionType.SET_USER, showSensitizationPopupSaga)
  yield takeEvery(ActionType.HIDE_SENSITIZATION_POPUP, hideSensitizationPopupSaga)
}

