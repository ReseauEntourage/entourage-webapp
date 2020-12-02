import { PreloadedState, StateFromReducersMapObject } from 'redux'
import { configureStore } from '../../configureStore'
import { createPromises } from '../../utils/createPromises'
import { PhoneLookUpResponse } from './IAuthUserGateway'
import { TestAuthUserGateway } from './TestAuthUserGateway'
import { TestAuthUserTokenStorage } from './TestAuthUserTokenStorage'
import { createUser } from './__mocks__'
import { publicActions } from './authUser.actions'
import { AuthUserErrorUnauthorized, AuthUserErrorUnkownPasswordError } from './authUser.errors'
import { authUserReducer, LoginSteps } from './authUser.reducer'
import { authUserSaga } from './authUser.saga'
import {
  selectIsLogging,
  selectStep,
  selectIsLogged,
  selectUser,
  selectErrors,
  selectLoginStepIsCompleted,
} from './authUser.selectors'
import {
  PhoneValidationsError,
  PasswordValidationsError,
  PasswordConfirmationValidationsError,
  SMSCodeValidationsError,
} from './authUser.validations'

const reducers = {
  authUser: authUserReducer,
}

function createSilentAuthUserTokenStorage() {
  const authUserTokenStorage = new TestAuthUserTokenStorage()
  authUserTokenStorage.getToken.mockImplementation()
  authUserTokenStorage.setToken.mockImplementation()
  authUserTokenStorage.removeToken.mockImplementation()

  return authUserTokenStorage
}

function configureStoreWithAuthUser(
  dependencies: Parameters<typeof configureStore>[0]['dependencies'],
  initialState?: PreloadedState<StateFromReducersMapObject<typeof reducers>>,
) {
  return configureStore({
    reducers,
    sagas: [authUserSaga],
    dependencies: {
      authUserTokenStorage: createSilentAuthUserTokenStorage(),
      ...dependencies,
    },
    initialState,
  })
}

describe('Auth User', () => {
  describe('before any action', () => {
    const authUserGateway = new TestAuthUserGateway()

    const store = configureStoreWithAuthUser({ authUserGateway })

    it('should isLogging state be false', () => {
      expect(selectIsLogging(store.getState())).toEqual(false)
    })

    it('should first step be phone', () => {
      expect(selectStep(store.getState())).toEqual(LoginSteps.PHONE)
    })
  })

  describe('during phone loockup', () => {
    const authUserGateway = new TestAuthUserGateway()
    const store = configureStoreWithAuthUser({ authUserGateway })

    it('should isLogging state be true', () => {
      authUserGateway.phoneLookUp.mockReturnValueOnce(Promise.resolve(PhoneLookUpResponse.PASSWORD_NEEDED))
      store.dispatch(publicActions.phoneLookUp('0600000000'))
      expect(selectIsLogging(store.getState())).toEqual(true)
    })

    it('should isLogging state be false after password needed response', async () => {
      authUserGateway.phoneLookUp.mockReturnValueOnce(Promise.resolve(PhoneLookUpResponse.PASSWORD_NEEDED))
      await store.dispatch(publicActions.phoneLookUp('0600000000'))
      expect(selectIsLogging(store.getState())).toEqual(false)
    })

    it('should isLogging state be false after sms code needed response', async () => {
      authUserGateway.phoneLookUp.mockReturnValueOnce(Promise.resolve(PhoneLookUpResponse.SMS_CODE_NEEDED))
      await store.dispatch(publicActions.phoneLookUp('0600000000'))
      expect(selectIsLogging(store.getState())).toEqual(false)
    })

    it('should isLogging state be false after not found response', async () => {
      const { promises, all } = createPromises({
        phoneLookup: PhoneLookUpResponse.PHONE_NOT_FOUND,
        createAccount: null,
      })

      authUserGateway.phoneLookUp.mockReturnValueOnce(promises.phoneLookup)
      authUserGateway.createAccount.mockReturnValueOnce(promises.createAccount)

      store.dispatch(publicActions.phoneLookUp('0600000000'))

      await all

      expect(selectIsLogging(store.getState())).toEqual(false)
    })
  })

  describe(
    'Given user hasn\'t any account. On phone look up with phone not found',
    () => {
      const testAuthUserGateway = new TestAuthUserGateway()
      testAuthUserGateway.phoneLookUp.mockReturnValueOnce(Promise.resolve(PhoneLookUpResponse.PHONE_NOT_FOUND))
      testAuthUserGateway.createAccount.mockReturnValueOnce(Promise.resolve(null))
      // @ts-expect-error
      testAuthUserGateway.loginWithSMSCode.mockReturnValue(Promise.resolve(null))
      testAuthUserGateway.definePassword.mockReturnValue(Promise.resolve(null))

      const store = configureStoreWithAuthUser({
        authUserGateway: testAuthUserGateway,
      })
      const phone = '0700000000'
      store.dispatch(publicActions.phoneLookUp(phone))

      it('should create account', () => {
        expect(testAuthUserGateway.phoneLookUp).toHaveBeenCalledTimes(1)
        expect(testAuthUserGateway.phoneLookUp).toHaveBeenCalledWith({ phone })
        expect(testAuthUserGateway.createAccount).toHaveBeenCalledTimes(1)
        expect(testAuthUserGateway.createAccount).toHaveBeenCalledWith({ phone })
      })

      it('should next step be SMS Code', () => {
        expect(selectStep(store.getState())).toEqual(LoginSteps.SMS_CODE)
      })
    },
  )

  describe('Given user must define password create password', () => {
    const testAuthUserGateway = new TestAuthUserGateway()
    testAuthUserGateway.definePassword.mockReturnValue(Promise.resolve(null))

    const initialState = {
      authUser: {
        step: LoginSteps.CREATE_PASSWORD,
        errors: {},
        isLogging: false,
        user: createUser(),
      },
    }

    const store = configureStoreWithAuthUser({
      authUserGateway: testAuthUserGateway,
    }, initialState)

    it('should create password', async () => {
      const password = 'abcdefghi'
      const passwordConfirmation = 'abcdefghi'
      await store.dispatch(publicActions.createPassword({ password, passwordConfirmation }))
      expect(selectStep(store.getState())).toEqual(null)
    })
  })

  describe('Given user has an account but not validated', () => {
    const testAuthUserGateway = new TestAuthUserGateway()
    testAuthUserGateway.phoneLookUp.mockReturnValueOnce(Promise.resolve(PhoneLookUpResponse.SMS_CODE_NEEDED))

    const store = configureStoreWithAuthUser({
      authUserGateway: testAuthUserGateway,
    })
    const phone = '0700000000'
    store.dispatch(publicActions.phoneLookUp(phone))

    it('should step be SMS code', () => {
      expect(selectStep(store.getState())).toEqual(LoginSteps.SMS_CODE)
    })
  })

  describe('Given user as an account', () => {
    const authUserGateway = new TestAuthUserGateway()
    const user = createUser()

    authUserGateway.phoneLookUp.mockReturnValue(Promise.resolve(PhoneLookUpResponse.PASSWORD_NEEDED))
    authUserGateway.resetPassword.mockReturnValue(Promise.resolve(null))
    authUserGateway.loginWithPassword.mockReturnValue(Promise.resolve(user))
    authUserGateway.loginWithSMSCode.mockReturnValue(Promise.resolve(user))

    it('should step be password after phone lock up', async () => {
      const store = configureStoreWithAuthUser({ authUserGateway })
      const phone = '0700000000'
      await store.dispatch(publicActions.phoneLookUp(phone))
      expect(selectStep(store.getState())).toEqual(LoginSteps.PASSWORD)
    })

    it('should reset password and next step should be SMS code', async () => {
      const store = configureStoreWithAuthUser({ authUserGateway })
      const phone = '0700000000'
      await store.dispatch(publicActions.resetPassword({ phone }))

      expect(authUserGateway.resetPassword).toHaveBeenCalledTimes(1)
      expect(authUserGateway.resetPassword).toHaveBeenCalledWith({ phone })
      expect(selectStep(store.getState())).toEqual(LoginSteps.SMS_CODE)
    })

    describe('when user is logged with password', () => {
      const store = configureStoreWithAuthUser({ authUserGateway })
      const phone = '0700000000'
      const password = 'abcdefghi'

      store.dispatch(publicActions.loginWithPassword({ phone, password }))

      it('should be logged', () => {
        expect(selectIsLogged(store.getState())).toEqual(true)
      })

      it('should have user', () => {
        expect(selectUser(store.getState())).toEqual(user)
      })

      it('should step be null', () => {
        expect(selectStep(store.getState())).toEqual(null)
      })

      // TODO
      //   it('should trigger onLogin', () => {
      //     expect(onLoginSubscribe).toHaveBeenCalledTimes(1)
      //   })
    })

    describe('when user is logged with SMS Code', () => {
      const store = configureStoreWithAuthUser({ authUserGateway })
      const phone = '0700000000'
      const SMSCode = 'abc'

      store.dispatch(publicActions.loginWithSMSCode({ phone, SMSCode }))

      it('should be logged', () => {
        expect(selectIsLogged(store.getState())).toEqual(true)
      })

      it('should have user', () => {
        expect(selectUser(store.getState())).toEqual(user)
      })

      it('should step be create password', () => {
        expect(selectStep(store.getState())).toEqual(LoginSteps.CREATE_PASSWORD)
        expect(authUserGateway.loginWithSMSCode).toHaveBeenCalledTimes(1)
        expect(authUserGateway.loginWithSMSCode).toHaveBeenCalledWith({ phone, SMSCode })
      })

      // TODO
      //   it('should trigger onLogin', () => {
      //     expect(onLoginSubscribe).toHaveBeenCalledTimes(1)
      //   })
    })

    // it.skip('should user be null on logout and be call logout gateway on logout', () => {
    //   // TODO
    // })
  })

  describe('Phone validation: phone look up', () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.phoneLookUp.mockReturnValue(Promise.resolve(PhoneLookUpResponse.PASSWORD_NEEDED))

    const store = configureStoreWithAuthUser({ authUserGateway })

    it('should haven\'t any error at first', () => {
      expect(selectErrors(store.getState())).toEqual({})
    })

    it('should have "required" error', () => {
      store.dispatch(publicActions.phoneLookUp(''))
      expect(selectErrors(store.getState())).toEqual({ phone: PhoneValidationsError.REQUIRED })
    })

    it('should have "invalid format" error', () => {
      store.dispatch(publicActions.phoneLookUp('abc'))
      expect(selectErrors(store.getState())).toEqual({ phone: PhoneValidationsError.INVALID_FORMAT })
    })

    it('should haven\'t any error on success after previous errors', () => {
      store.dispatch(publicActions.phoneLookUp('0600000000'))
      expect(selectErrors(store.getState())).toEqual({})
    })
  })

  describe('Phone validation: reset password', () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.resetPassword.mockReturnValue(Promise.resolve(null))

    const store = configureStoreWithAuthUser({ authUserGateway })

    it('should haven\'t any error at first', () => {
      expect(selectErrors(store.getState())).toEqual({})
    })

    it('should have "required" error', () => {
      store.dispatch(publicActions.resetPassword({ phone: '' }))
      expect(selectErrors(store.getState())).toEqual({ phone: PhoneValidationsError.REQUIRED })
    })

    it('should have "invalid format" error', () => {
      store.dispatch(publicActions.resetPassword({ phone: 'abc' }))
      expect(selectErrors(store.getState())).toEqual({ phone: PhoneValidationsError.INVALID_FORMAT })
    })

    it('should haven\'t any error on success after previous errors', () => {
      store.dispatch(publicActions.resetPassword({ phone: '0600000000' }))
      expect(selectErrors(store.getState())).toEqual({})
    })
  })

  describe('Password validations', () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.definePassword.mockReturnValue(Promise.resolve(null))
    const store = configureStoreWithAuthUser({ authUserGateway })

    it('should have no error at first', () => {
      expect(store.getState().authUser.errors).toEqual({})
    })

    it('define password: should have "required" error', () => {
      store.dispatch(publicActions.createPassword({ password: '', passwordConfirmation: '' }))

      expect(store.getState().authUser.errors).toEqual({
        password: PasswordValidationsError.REQUIRED,
        passwordConfirmation: PasswordConfirmationValidationsError.REQUIRED,
      })
    })

    it('define password: should have "too sort" error', () => {
      store.dispatch(publicActions.createPassword({ password: 'abc', passwordConfirmation: 'abc' }))

      expect(store.getState().authUser.errors).toEqual({
        password: PasswordValidationsError.PASSWORD_TOO_SHORT,
        passwordConfirmation: undefined,
      })
    })

    it('define password: should have "no match" error', () => {
      store.dispatch(publicActions.createPassword({ password: 'abcdefghi', passwordConfirmation: 'a' }))

      expect(store.getState().authUser.errors).toEqual({
        passwordConfirmation: PasswordConfirmationValidationsError.PASSWORD_CONFIRMATION_NOT_MATCH,
      })
    })

    it('define password: should haven\'t any error', () => {
      store.dispatch(publicActions.createPassword({ password: 'abcdefghi', passwordConfirmation: 'abcdefghi' }))

      expect(store.getState().authUser.errors).toEqual({})
    })
  })

  describe('Auth user bad credential', () => {
    it('should show invalid password', async () => {
      const authUserGateway = new TestAuthUserGateway()
      authUserGateway.loginWithPassword.mockImplementationOnce(() => { throw new AuthUserErrorUnauthorized() })
      const store = configureStoreWithAuthUser({ authUserGateway })

      const phone = '0600000000'
      let password = ''
      await store.dispatch(publicActions.loginWithPassword({ phone, password }))

      expect(store.getState().authUser.errors).toEqual({
        password: PasswordValidationsError.REQUIRED,
      })

      password = 'xxx'
      await store.dispatch(publicActions.loginWithPassword({ phone, password }))

      expect(store.getState().authUser.errors).toEqual({
        password: PasswordValidationsError.INVALID_PASSWORD,
      })
    })
  })

  it('should show invalid SMS Code', async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.loginWithSMSCode.mockImplementationOnce(() => { throw new AuthUserErrorUnauthorized() })
    const store = configureStoreWithAuthUser({ authUserGateway })

    const phone = '0600000000'
    let SMSCode = ''
    await store.dispatch(publicActions.loginWithSMSCode({ phone, SMSCode }))

    expect(store.getState().authUser.errors).toEqual({
      code: SMSCodeValidationsError.REQUIRED,
    })

    SMSCode = 'xxx'
    await store.dispatch(publicActions.loginWithSMSCode({ phone, SMSCode }))

    expect(store.getState().authUser.errors).toEqual({
      code: SMSCodeValidationsError.INVALID_SMS_CODE,
    })
  })

  it('should catch server error on password creation', async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.definePassword.mockImplementationOnce(() => {
      throw new AuthUserErrorUnkownPasswordError('foo error')
    })
    const store = configureStoreWithAuthUser({ authUserGateway })

    const password = 'abcdefghi'

    await store.dispatch(publicActions.createPassword({
      password,
      passwordConfirmation: password,
    }))

    expect(store.getState().authUser.errors).toEqual({
      password: PasswordValidationsError.UNKNOWN_SERVER_ERROR,
      passwordUnknowServerError: 'foo error',
    })
  })

  describe('reset', () => {
    it('should reset form', () => {
      const authUserGateway = new TestAuthUserGateway()
      const initialState = {
        authUser: {
          step: LoginSteps.PASSWORD,
          errors: { phone: PhoneValidationsError.REQUIRED },
          isLogging: false,
          user: createUser(),
        },
      }
      const store = configureStoreWithAuthUser({ authUserGateway }, initialState)
      store.dispatch(publicActions.resetForm())

      expect(store.getState().authUser).toEqual({
        ...initialState.authUser,
        step: LoginSteps.PHONE,
        errors: {},
        isLogging: false,
      })
    })
  })

  describe('step logging', () => {
    it('should be uncompleted', () => {
      const authUserGateway = new TestAuthUserGateway()
      const initialState = {
        authUser: {
          step: LoginSteps.PASSWORD,
          errors: { phone: PhoneValidationsError.REQUIRED },
          isLogging: false,
          user: createUser(),
        },
      }

      const store = configureStoreWithAuthUser({ authUserGateway }, initialState)

      expect(selectLoginStepIsCompleted(store.getState())).toBe(false)
    })

    it('should be completed', () => {
      const authUserGateway = new TestAuthUserGateway()
      const initialState = {
        authUser: {
          step: null,
          errors: { phone: PhoneValidationsError.REQUIRED },
          isLogging: false,
          user: createUser(),
        },
      }

      const store = configureStoreWithAuthUser({ authUserGateway }, initialState)

      expect(selectLoginStepIsCompleted(store.getState())).toBe(true)
    })
  })

  describe('token storage', () => {
    it('should save user token with login from password', async () => {
      const user = createUser()

      const authUserTokenStorage = new TestAuthUserTokenStorage()
      const authUserGateway = new TestAuthUserGateway()
      authUserTokenStorage.setToken.mockReturnValueOnce()
      authUserGateway.loginWithPassword.mockReturnValueOnce(Promise.resolve(user))

      const store = configureStoreWithAuthUser({ authUserGateway, authUserTokenStorage })

      const phone = '0600000000'
      const password = 'xxx'

      await store.dispatch(publicActions.loginWithPassword({ phone, password }))

      expect(authUserTokenStorage.setToken).toHaveBeenNthCalledWith(1, user.token)
      expect(authUserTokenStorage.setToken).toHaveBeenCalledTimes(1)
    })

    it('should save user token with login from SMS code', async () => {
      const user = createUser()

      const authUserTokenStorage = new TestAuthUserTokenStorage()
      const authUserGateway = new TestAuthUserGateway()
      authUserTokenStorage.setToken.mockReturnValueOnce()
      authUserGateway.loginWithSMSCode.mockReturnValueOnce(Promise.resolve(user))

      const store = configureStoreWithAuthUser({ authUserGateway, authUserTokenStorage })

      const phone = '0600000000'
      const SMSCode = 'xxx'

      await store.dispatch(publicActions.loginWithSMSCode({ phone, SMSCode }))

      expect(authUserTokenStorage.setToken).toHaveBeenNthCalledWith(1, user.token)
      expect(authUserTokenStorage.setToken).toHaveBeenCalledTimes(1)
    })

    // TODO
    // it.skip('should remove user token on logout', () => {})
  })

  describe('Giver user is not set', () => {
    const authUserGateway = new TestAuthUserGateway()
    const store = configureStoreWithAuthUser({ authUserGateway })
    const user = createUser()

    store.dispatch(publicActions.setUser(user))

    it('should set user', () => {
      expect(selectUser(store.getState())).toBeTruthy()
      expect(selectUser(store.getState())).toEqual(user)
    })
  })
})
