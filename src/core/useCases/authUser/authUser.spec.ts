import { configureStore } from '../../configureStore'
import { PatialAppDependencies } from '../Dependencies'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'
import { PhoneLookUpResponse } from './IAuthUserGateway'
import { TestAuthUserGateway } from './TestAuthUserGateway'
import { TestAuthUserTokenStorage } from './TestAuthUserTokenStorage'
import { createUser } from './__mocks__'
import { publicActions } from './authUser.actions'
import { AuthUserErrorUnauthorized, AuthUserErrorUnkownPasswordError } from './authUser.errors'
import { LoginSteps } from './authUser.reducer'
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

function createSilentAuthUserTokenStorage() {
  const authUserTokenStorage = new TestAuthUserTokenStorage()
  authUserTokenStorage.getToken.mockImplementation()
  authUserTokenStorage.setToken.mockImplementation()
  authUserTokenStorage.removeToken.mockImplementation()

  return authUserTokenStorage
}

function configureStoreWithAuthUser(
  params: {
    dependencies?: PatialAppDependencies;
    initialAppState?: PartialAppState;
  },
) {
  const { initialAppState, dependencies } = params

  return configureStore({
    reducers,
    initialState: {
      ...defaultInitialAppState,
      ...initialAppState,
    },
    dependencies: {
      authUserTokenStorage: createSilentAuthUserTokenStorage(),
      ...dependencies,
    },
    sagas: [authUserSaga],
  })
}

function configureStoreWithUserAccount() {
  const authUserGateway = new TestAuthUserGateway()
  const user = createUser()

  const deferredValues = {
    phoneLookup: PhoneLookUpResponse.PASSWORD_NEEDED,
    resetPassword: null,
    loginWithPassword: user,
    loginWithSMSCode: user,
  }

  authUserGateway.phoneLookUp.mockDeferredValueOnce(deferredValues.phoneLookup)
  authUserGateway.resetPassword.mockDeferredValueOnce(deferredValues.resetPassword)
  authUserGateway.loginWithPassword.mockDeferredValueOnce(deferredValues.loginWithPassword)
  authUserGateway.loginWithSMSCode.mockDeferredValueOnce(deferredValues.loginWithSMSCode)

  const resolveAllDeferredValue = () => {
    authUserGateway.phoneLookUp.resolveDeferredValue()
    authUserGateway.resetPassword.resolveDeferredValue()
    authUserGateway.loginWithPassword.resolveDeferredValue()
    authUserGateway.loginWithSMSCode.resolveDeferredValue()
  }

  const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

  return {
    store,
    authUserGateway,
    resolveAllDeferredValue,
    user,
  }
}

describe('Auth User', () => {
  it(`
    Given initial state
    When no action is triggered
    Then the user should not be logging
      And first step should be "phone"
  `, () => {
    const authUserGateway = new TestAuthUserGateway()

    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

    expect(selectIsLogging(store.getState())).toEqual(false)

    expect(selectStep(store.getState())).toEqual(LoginSteps.PHONE)
  })

  it(`
    Given server ask password on phone lookup
    When user trigger phone lookup
    Then the user should be logging during phone lookup
      And the user should not be logging after request succeeded
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.phoneLookUp.mockDeferredValueOnce(PhoneLookUpResponse.PASSWORD_NEEDED)

    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

    store.dispatch(publicActions.phoneLookUp('0600000000'))

    expect(selectIsLogging(store.getState())).toEqual(true)

    authUserGateway.phoneLookUp.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectIsLogging(store.getState())).toEqual(false)
  })

  it(`
    Given server ask SMS Code on phone lookup
    When user trigger phone lookup
    Then user should be logging during phone lookup
      And user should not be logging after request succeeded
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.phoneLookUp.mockDeferredValueOnce(PhoneLookUpResponse.SMS_CODE_NEEDED)

    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

    store.dispatch(publicActions.phoneLookUp('0600000000'))

    expect(selectIsLogging(store.getState())).toEqual(true)

    authUserGateway.phoneLookUp.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectIsLogging(store.getState())).toEqual(false)
  })

  it(`
    Given server does not found user on phone lookup
    When user trigger phone lookup
    Then user should be logging during phone lookup
      And user should not be logging after request succeeded
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.phoneLookUp.mockDeferredValueOnce(PhoneLookUpResponse.PHONE_NOT_FOUND)
    authUserGateway.createAccount.mockDeferredValueOnce(null)

    const resolveAllDeferredValue = () => {
      authUserGateway.phoneLookUp.resolveDeferredValue()
      authUserGateway.createAccount.resolveDeferredValue()
    }

    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

    store.dispatch(publicActions.phoneLookUp('0600000000'))

    expect(selectIsLogging(store.getState())).toEqual(true)

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(selectIsLogging(store.getState())).toEqual(false)
  })

  it(`
    Given user hasn't any account and server return not found on phone lookup
    When user trigger phone lookup
    Then a use account should be created
      And next step should be SMS Code
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()

    const deferredValues = {
      phoneLookup: PhoneLookUpResponse.PHONE_NOT_FOUND,
      createAccount: null,
      loginWithSMSCode: null,
      definePassword: null,
    }

    authUserGateway.phoneLookUp.mockDeferredValueOnce(deferredValues.phoneLookup)
    authUserGateway.createAccount.mockDeferredValueOnce(deferredValues.createAccount)
    // @ts-expect-error
    authUserGateway.loginWithSMSCode.mockDeferredValueOnce(deferredValues.loginWithSMSCode)
    authUserGateway.definePassword.mockDeferredValueOnce(deferredValues.definePassword)

    const resolveAllDeferredValue = () => {
      authUserGateway.phoneLookUp.resolveDeferredValue()
      authUserGateway.createAccount.resolveDeferredValue()
      authUserGateway.loginWithSMSCode.resolveDeferredValue()
      authUserGateway.definePassword.resolveDeferredValue()
    }

    const store = configureStoreWithAuthUser({
      dependencies: { authUserGateway },
    })
    const phone = '0700000000'

    store.dispatch(publicActions.phoneLookUp(phone))

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(authUserGateway.phoneLookUp).toHaveBeenCalledTimes(1)
    expect(authUserGateway.phoneLookUp).toHaveBeenCalledWith({ phone })
    expect(authUserGateway.createAccount).toHaveBeenCalledTimes(1)
    expect(authUserGateway.createAccount).toHaveBeenCalledWith({ phone })

    expect(selectStep(store.getState())).toEqual(LoginSteps.SMS_CODE)
  })

  it(`
    Given user must define password
    When user want to create password
    Then password should be created
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.definePassword.mockDeferredValueOnce(null)

    const initialAppState = {
      authUser: {
        step: LoginSteps.CREATE_PASSWORD,
        errors: {},
        isLogging: false,
        user: createUser(),
      },
    }

    const store = configureStoreWithAuthUser({
      dependencies: {
        authUserGateway,
      },
      initialAppState,
    })

    const password = 'abcdefghi'
    const passwordConfirmation = 'abcdefghi'

    store.dispatch(publicActions.createPassword({ password, passwordConfirmation }))

    authUserGateway.definePassword.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectStep(store.getState())).toEqual(null)
  })

  it(`
    Given server return SMS Code needed on phone lookup
    When user trigger phone lookup
    Then step should be SMS Code after request succeeded
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.phoneLookUp.mockDeferredValueOnce(PhoneLookUpResponse.SMS_CODE_NEEDED)

    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })
    const phone = '0700000000'

    store.dispatch(publicActions.phoneLookUp(phone))

    authUserGateway.phoneLookUp.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectStep(store.getState())).toEqual(LoginSteps.SMS_CODE)
  })

  it(`
    Given user as an account
    When user trigger phone lookup
    Then step should be password after request succeeded
  `, async () => {
    const { store, resolveAllDeferredValue } = configureStoreWithUserAccount()

    const phone = '0700000000'
    store.dispatch(publicActions.phoneLookUp(phone))

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(selectStep(store.getState())).toEqual(LoginSteps.PASSWORD)
  })

  it(`
    Given user as an account
    When user want to reset password
    Then password reset request should be called once with phone number
      And next step should be SMS Code
  `, async () => {
    const { store, resolveAllDeferredValue, authUserGateway } = configureStoreWithUserAccount()

    const phone = '0700000000'
    store.dispatch(publicActions.resetPassword({ phone }))

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(authUserGateway.resetPassword).toHaveBeenCalledTimes(1)
    expect(authUserGateway.resetPassword).toHaveBeenCalledWith({ phone })

    expect(selectStep(store.getState())).toEqual(LoginSteps.SMS_CODE)
  })

  it(`
    Given user as an account
    When user want to login with password
    Then user should be logging during request
      And user should be logged after request succeeded
      And user data should be equal to server response
      And there should not be a next step
  `, async () => {
    const { store, resolveAllDeferredValue, user } = configureStoreWithUserAccount()
    const phone = '0700000000'
    const password = 'abcdefghi'

    store.dispatch(publicActions.loginWithPassword({ phone, password }))

    // TODO
    // expect(selectIsLogging(store.getState())).toEqual(true)

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(selectIsLogged(store.getState())).toEqual(true)

    expect(selectUser(store.getState())).toEqual(user)

    expect(selectStep(store.getState())).toEqual(null)
  })

  it(`
    Given user as an account
    When user want to login with SMS Code
    Then user should be logging during request
      And user should be logged after request succeeded
      And user data should be equal to server response
      And next step should be password creation
  `, async () => {
    const { store, resolveAllDeferredValue, user, authUserGateway } = configureStoreWithUserAccount()
    const phone = '0700000000'
    const SMSCode = 'abc'

    store.dispatch(publicActions.loginWithSMSCode({ phone, SMSCode }))

    // TODO
    // expect(selectIsLogging(store.getState())).toEqual(true)

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(selectIsLogged(store.getState())).toEqual(true)

    expect(selectUser(store.getState())).toEqual(user)

    expect(selectStep(store.getState())).toEqual(LoginSteps.CREATE_PASSWORD)
    expect(authUserGateway.loginWithSMSCode).toHaveBeenCalledTimes(1)
    expect(authUserGateway.loginWithSMSCode).toHaveBeenCalledWith({ phone, SMSCode })
  })

  describe('Phone validation: phone look up', () => {
    function configureStoreWithPasswordNeeded() {
      const authUserGateway = new TestAuthUserGateway()
      authUserGateway.phoneLookUp.mockDeferredValueOnce(PhoneLookUpResponse.PASSWORD_NEEDED)

      const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

      return {
        store,
      }
    }

    it(`
      Given initial state
      When no action is triggered
      Then there should be no error
    `, () => {
      const { store } = configureStoreWithPasswordNeeded()

      expect(selectErrors(store.getState())).toEqual({})
    })

    it(`
      Given initial state
      When user set a empty phone number
      Then there should be phone error as required phone
    `, () => {
      const { store } = configureStoreWithPasswordNeeded()

      store.dispatch(publicActions.phoneLookUp(''))

      expect(selectErrors(store.getState())).toEqual({ phone: PhoneValidationsError.REQUIRED })
    })

    it(`
      Given initial state
      When user set an invalid phone number with letter
      Then there should be phone error as invalid format
    `, () => {
      const { store } = configureStoreWithPasswordNeeded()

      store.dispatch(publicActions.phoneLookUp('abc'))

      expect(selectErrors(store.getState())).toEqual({ phone: PhoneValidationsError.INVALID_FORMAT })
    })

    it(`
      Given initial state
      When user set an invalid phone number with letter
        And correct his error with a valid phone number
      Then there should first be a phone error as invalid format
        And that error should disappear after correction
    `, () => {
      const { store } = configureStoreWithPasswordNeeded()

      store.dispatch(publicActions.phoneLookUp('abc'))

      expect(selectErrors(store.getState())).toEqual({ phone: PhoneValidationsError.INVALID_FORMAT })

      store.dispatch(publicActions.phoneLookUp('0600000000'))

      expect(selectErrors(store.getState())).toEqual({})
    })
  })

  describe('Phone validation: reset password', () => {
    function configureStoreWithResetPassword() {
      const authUserGateway = new TestAuthUserGateway()
      authUserGateway.resetPassword.mockDeferredValueOnce(null)

      const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

      return {
        store,
      }
    }

    it(`
      Given initial state
      When no action is triggered
      Then there should be no error
    `, () => {
      const { store } = configureStoreWithResetPassword()

      expect(selectErrors(store.getState())).toEqual({})
    })

    it(`
      Given initial state
      When user want to reset password with an empty phone number
      Then there should be a phone error as required phone
    `, () => {
      const { store } = configureStoreWithResetPassword()

      store.dispatch(publicActions.resetPassword({ phone: '' }))

      expect(selectErrors(store.getState())).toEqual({ phone: PhoneValidationsError.REQUIRED })
    })

    it(`
      Given initial state
      When user want to reset password with an invalid empty phone number with letters
      Then there should be a phone error as invalid format
    `, () => {
      const { store } = configureStoreWithResetPassword()

      store.dispatch(publicActions.resetPassword({ phone: 'abc' }))

      expect(selectErrors(store.getState())).toEqual({ phone: PhoneValidationsError.INVALID_FORMAT })
    })

    it(`
      Given initial state
      When user want to reset password with an invalid empty phone number with letters
        And correct his error with a valid phone number
      Then there should first be a phone error as invalid format
        And that error should disappear after correction
    `, () => {
      const { store } = configureStoreWithResetPassword()

      store.dispatch(publicActions.resetPassword({ phone: 'abc' }))

      expect(selectErrors(store.getState())).toEqual({ phone: PhoneValidationsError.INVALID_FORMAT })

      store.dispatch(publicActions.resetPassword({ phone: '0600000000' }))

      expect(selectErrors(store.getState())).toEqual({})
    })
  })

  describe('Password validations', () => {
    function configureStoreWithDefinedPassword() {
      const authUserGateway = new TestAuthUserGateway()
      authUserGateway.definePassword.mockReturnValue(Promise.resolve(null))

      const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

      return {
        store,
      }
    }

    it(`
      Given initial state
      When no action is triggered
      Then there should be no error
    `, () => {
      const { store } = configureStoreWithDefinedPassword()
      expect(selectErrors(store.getState())).toEqual({})
    })

    it(`
      Given initial state
      When user defined empty password
        And user defined an empty password confirmation
      Then there should be an error as required password
        And there should be an error as required password confirmation
    `, () => {
      const { store } = configureStoreWithDefinedPassword()

      store.dispatch(publicActions.createPassword({ password: '', passwordConfirmation: '' }))

      expect(selectErrors(store.getState())).toEqual({
        password: PasswordValidationsError.REQUIRED,
        passwordConfirmation: PasswordConfirmationValidationsError.REQUIRED,
      })
    })

    it(`
      Given initial state
      When user defined password too short
        And user defined a password confirmation too short
      Then there should be an error as too short password
        And there should be an error as too short password confirmation
    `, () => {
      const { store } = configureStoreWithDefinedPassword()

      store.dispatch(publicActions.createPassword({ password: 'abc', passwordConfirmation: 'abc' }))

      expect(selectErrors(store.getState())).toEqual({
        password: PasswordValidationsError.PASSWORD_TOO_SHORT,
        passwordConfirmation: undefined,
      })
    })

    it(`
      Given initial state
      When user defined a valid password
        And user defined a password confirmation different than password
      Then there should be an error as password confirmation doesn't match password
    `, () => {
      const { store } = configureStoreWithDefinedPassword()

      store.dispatch(publicActions.createPassword({ password: 'abcdefghi', passwordConfirmation: 'a' }))

      expect(selectErrors(store.getState())).toEqual({
        passwordConfirmation: PasswordConfirmationValidationsError.PASSWORD_CONFIRMATION_NOT_MATCH,
      })
    })

    it(`
      Given initial state
      When user defined empty password
        And user defined an empty password confirmation
        And user correct his error
      Then there should first be an error as required password and password confirmation
        And that error should disappear after correction
    `, () => {
      const { store } = configureStoreWithDefinedPassword()

      store.dispatch(publicActions.createPassword({ password: '', passwordConfirmation: '' }))

      expect(selectErrors(store.getState())).toEqual({
        password: PasswordValidationsError.REQUIRED,
        passwordConfirmation: PasswordConfirmationValidationsError.REQUIRED,
      })

      store.dispatch(publicActions.createPassword({ password: 'abcdefgh', passwordConfirmation: 'abcdefgh' }))

      expect(selectErrors(store.getState())).toEqual({})
    })
  })

  it(`
    Given user has an account
    When user set bad credential
    Then there should be an error as invalid password
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.loginWithPassword.mockDeferredValueOnce(createUser())
    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

    const phone = '0600000000'
    const password = 'xxx'

    store.dispatch(publicActions.loginWithPassword({ phone, password }))

    authUserGateway.loginWithPassword.rejectDeferredValue(new AuthUserErrorUnauthorized())
    await store.waitForActionEnd()

    expect(selectErrors(store.getState())).toEqual({
      password: PasswordValidationsError.INVALID_PASSWORD,
    })
  })

  // TODO CONTINUE

  it('should show invalid SMS Code', async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.loginWithSMSCode.mockDeferredValueOnce(createUser())
    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

    const phone = '0600000000'
    let SMSCode = ''
    store.dispatch(publicActions.loginWithSMSCode({ phone, SMSCode }))

    expect(store.getState().authUser.errors).toEqual({
      code: SMSCodeValidationsError.REQUIRED,
    })

    SMSCode = 'xxx'
    store.dispatch(publicActions.loginWithSMSCode({ phone, SMSCode }))

    authUserGateway.loginWithSMSCode.rejectDeferredValue(new AuthUserErrorUnauthorized())
    await store.waitForActionEnd()

    expect(store.getState().authUser.errors).toEqual({
      code: SMSCodeValidationsError.INVALID_SMS_CODE,
    })
  })

  it('should catch server error on password creation', async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.definePassword.mockDeferredValueOnce(null)
    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

    const password = 'abcdefghi'

    store.dispatch(publicActions.createPassword({
      password,
      passwordConfirmation: password,
    }))

    authUserGateway.definePassword.rejectDeferredValue(new AuthUserErrorUnkownPasswordError('foo error'))
    await store.waitForActionEnd()

    expect(store.getState().authUser.errors).toEqual({
      password: PasswordValidationsError.UNKNOWN_SERVER_ERROR,
      passwordUnknowServerError: 'foo error',
    })
  })

  describe('reset', () => {
    it('should reset form', () => {
      const authUserGateway = new TestAuthUserGateway()
      const initialAppState = {
        authUser: {
          step: LoginSteps.PASSWORD,
          errors: { phone: PhoneValidationsError.REQUIRED },
          isLogging: false,
          user: createUser(),
        },
      }
      const store = configureStoreWithAuthUser({
        dependencies: { authUserGateway },
        initialAppState,
      })
      store.dispatch(publicActions.resetForm())

      expect(store.getState().authUser).toEqual({
        ...initialAppState.authUser,
        step: LoginSteps.PHONE,
        errors: {},
        isLogging: false,
      })
    })
  })

  describe('step logging', () => {
    it('should be uncompleted', () => {
      const authUserGateway = new TestAuthUserGateway()
      const initialAppState = {
        authUser: {
          step: LoginSteps.PASSWORD,
          errors: { phone: PhoneValidationsError.REQUIRED },
          isLogging: false,
          user: createUser(),
        },
      }

      const store = configureStoreWithAuthUser({
        dependencies: { authUserGateway },
        initialAppState,
      })

      expect(selectLoginStepIsCompleted(store.getState())).toBe(false)
    })

    it('should be completed', () => {
      const authUserGateway = new TestAuthUserGateway()
      const initialAppState = {
        authUser: {
          step: null,
          errors: { phone: PhoneValidationsError.REQUIRED },
          isLogging: false,
          user: createUser(),
        },
      }

      const store = configureStoreWithAuthUser({
        dependencies: { authUserGateway },
        initialAppState,
      })

      expect(selectLoginStepIsCompleted(store.getState())).toBe(true)
    })
  })

  describe('token storage', () => {
    it('should save user token with login from password', async () => {
      const user = createUser()

      const authUserTokenStorage = new TestAuthUserTokenStorage()
      const authUserGateway = new TestAuthUserGateway()
      authUserTokenStorage.setToken.mockReturnValueOnce()
      authUserGateway.loginWithPassword.mockDeferredValueOnce(user)

      const store = configureStoreWithAuthUser({
        dependencies: {
          authUserGateway,
          authUserTokenStorage,
        },
      })

      const phone = '0600000000'
      const password = 'xxx'

      store.dispatch(publicActions.loginWithPassword({ phone, password }))

      authUserGateway.loginWithPassword.resolveDeferredValue()
      await store.waitForActionEnd()

      expect(authUserTokenStorage.setToken).toHaveBeenNthCalledWith(1, user.token)
      expect(authUserTokenStorage.setToken).toHaveBeenCalledTimes(1)
    })

    it('should save user token with login from SMS code', async () => {
      const user = createUser()

      const authUserTokenStorage = new TestAuthUserTokenStorage()
      const authUserGateway = new TestAuthUserGateway()
      authUserTokenStorage.setToken.mockReturnValueOnce()
      authUserGateway.loginWithSMSCode.mockDeferredValueOnce(user)

      const store = configureStoreWithAuthUser({
        dependencies: {
          authUserGateway,
          authUserTokenStorage,
        },
      })

      const phone = '0600000000'
      const SMSCode = 'xxx'

      store.dispatch(publicActions.loginWithSMSCode({ phone, SMSCode }))

      authUserGateway.loginWithSMSCode.resolveDeferredValue()
      await store.waitForActionEnd()

      expect(authUserTokenStorage.setToken).toHaveBeenNthCalledWith(1, user.token)
      expect(authUserTokenStorage.setToken).toHaveBeenCalledTimes(1)
    })

    // TODO
    // it.skip('should remove user token on logout', () => {})
  })

  describe('Giver user is not set', () => {
    const authUserGateway = new TestAuthUserGateway()
    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })
    const user = createUser()

    store.dispatch(publicActions.setUser(user))

    it('should set user', () => {
      expect(selectUser(store.getState())).toBeTruthy()
      expect(selectUser(store.getState())).toEqual(user)
    })
  })
})
