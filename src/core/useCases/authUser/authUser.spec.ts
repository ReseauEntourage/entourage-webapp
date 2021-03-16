import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { firebaseSaga } from '../firebase'
import { TestFirebaseService } from '../firebase/TestFirebaseService'
import { locationSaga, selectLocation } from '../location'
import { TestGeolocationService } from '../location/TestGeolocationService'
import { defaultLocationState } from '../location/location.reducer'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'
import { assertIsDefined } from 'src/utils/misc'
import { PhoneLookUpResponse } from './IAuthUserGateway'
import { TestAuthUserGateway } from './TestAuthUserGateway'
import { TestAuthUserSensitizationStorage } from './TestAuthUserSensitizationStorage'
import { TestAuthUserTokenStorage } from './TestAuthUserTokenStorage'
import { createUser } from './__mocks__'
import { publicActions } from './authUser.actions'
import { AuthUserErrorUnauthorized, AuthUserErrorUnkownPasswordError } from './authUser.errors'
import { LoginSteps, defaultAuthUserState } from './authUser.reducer'
import { authUserSaga } from './authUser.saga'
import {
  selectIsLogging,
  selectStep,
  selectIsLogged,
  selectUser,
  selectErrors,
  selectLoginIsCompleted,
  selectShowSensitizationPopup,
  selectUserIsUpdating,
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

function createSilentFirebaseService() {
  const firebaseService = new TestFirebaseService()
  firebaseService.setUser.mockImplementation()
  firebaseService.sendEvent.mockImplementation()

  return firebaseService
}

function createSilentGeolocationService() {
  const geolocationService = new TestGeolocationService()
  geolocationService.getGeolocation.mockImplementation()
  geolocationService.getPlaceAddressFromCoordinates.mockImplementation()

  return geolocationService
}

function configureStoreWithAuthUser(
  params: {
    dependencies?: PartialAppDependencies;
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
      firebaseService: createSilentFirebaseService(),
      geolocationService: createSilentGeolocationService(),
      ...dependencies,
    },
    sagas: [authUserSaga, firebaseSaga, locationSaga],
  })
}

function configureStoreWithUserAccount(isFirstSignIn?: boolean, isActiveUser?: boolean) {
  const authUserGateway = new TestAuthUserGateway()
  const firebaseService = new TestFirebaseService()
  const authUserSensitizationStorage = new TestAuthUserSensitizationStorage()
  const user = createUser(isFirstSignIn, isActiveUser)

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
  firebaseService.setUser.mockReturnValueOnce()

  const resolveAllDeferredValue = () => {
    authUserGateway.phoneLookUp.resolveDeferredValue()
    authUserGateway.resetPassword.resolveDeferredValue()
    authUserGateway.loginWithPassword.resolveDeferredValue()
    authUserGateway.loginWithSMSCode.resolveDeferredValue()
  }

  const store = configureStoreWithAuthUser({
    dependencies: {
      authUserGateway,
      authUserSensitizationStorage,
      firebaseService },
  })

  return {
    store,
    authUserGateway,
    authUserSensitizationStorage,
    firebaseService,
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
      And login should not be completed
  `, () => {
    const authUserGateway = new TestAuthUserGateway()

    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

    expect(selectIsLogging(store.getState())).toEqual(false)

    expect(selectStep(store.getState())).toEqual(LoginSteps.PHONE)

    expect(selectLoginIsCompleted(store.getState())).toEqual(false)
  })

  it(`
    Given server ask password on phone lookup
    When user trigger phone lookup
    Then the user should be logging during phone lookup
      And the user should not be logging after request succeeded
      And login should not be completed
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.phoneLookUp.mockDeferredValueOnce(PhoneLookUpResponse.PASSWORD_NEEDED)

    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

    store.dispatch(publicActions.phoneLookUp('0600000000'))

    expect(selectIsLogging(store.getState())).toEqual(true)

    authUserGateway.phoneLookUp.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectIsLogging(store.getState())).toEqual(false)
    expect(selectLoginIsCompleted(store.getState())).toEqual(false)
  })

  it(`
    Given server ask SMS Code on phone lookup
    When user trigger phone lookup
    Then user should be logging during phone lookup
      And user should not be logging after request succeeded
      And login should not be completed

  `, async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.phoneLookUp.mockDeferredValueOnce(PhoneLookUpResponse.SMS_CODE_NEEDED)

    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })

    store.dispatch(publicActions.phoneLookUp('0600000000'))

    expect(selectIsLogging(store.getState())).toEqual(true)

    authUserGateway.phoneLookUp.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectIsLogging(store.getState())).toEqual(false)
    expect(selectLoginIsCompleted(store.getState())).toEqual(false)
  })

  it(`
    Given server does not found user on phone lookup
    When user trigger phone lookup
    Then user should be logging during phone lookup
      And user should not be logging after request succeeded
      And login should not be completed
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
    expect(selectLoginIsCompleted(store.getState())).toEqual(false)
  })

  it(`
    Given user hasn't any account and server return not found on phone lookup
    When user trigger phone lookup
    Then next step should be create account
      And login should not be completed
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()

    const deferredValues = {
      phoneLookup: PhoneLookUpResponse.PHONE_NOT_FOUND,
    }

    authUserGateway.phoneLookUp.mockDeferredValueOnce(deferredValues.phoneLookup)

    const resolveAllDeferredValue = () => {
      authUserGateway.phoneLookUp.resolveDeferredValue()
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

    expect(selectStep(store.getState())).toEqual(LoginSteps.CREATE_ACCOUNT)
    expect(selectLoginIsCompleted(store.getState())).toEqual(false)
  })

  it(`
    Given user hasn't any account and server return not found on phone lookup
    When user trigger account creation
    Then user should be logging during request
      And user should not be logging after request
      And a user account creation should have been called with phone number
      And next step should be SMS Code
      And login should not be completed
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()

    const deferredValues = {
      createAccount: null,
      loginWithSMSCode: null,
      definePassword: null,
    }

    authUserGateway.createAccount.mockDeferredValueOnce(deferredValues.createAccount)

    const store = configureStoreWithAuthUser({
      dependencies: { authUserGateway },
    })
    const phone = '0700000000'

    store.dispatch(publicActions.createAccount(phone))

    expect(selectIsLogging(store.getState())).toEqual(true)

    authUserGateway.createAccount.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectIsLogging(store.getState())).toEqual(false)

    expect(authUserGateway.createAccount).toHaveBeenCalledTimes(1)
    expect(authUserGateway.createAccount).toHaveBeenCalledWith({ phone })

    expect(selectStep(store.getState())).toEqual(LoginSteps.SMS_CODE)
    expect(selectLoginIsCompleted(store.getState())).toEqual(false)
  })

  it(`
    Given user must define password
    When user want to create password
    Then password should be created
      And login should be completed
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()
    const authUserSensitizationStorage = new TestAuthUserSensitizationStorage()
    authUserGateway.definePassword.mockDeferredValueOnce(null)

    const initialAppState = {
      authUser: {
        step: LoginSteps.CREATE_PASSWORD,
        errors: {},
        isLogging: false,
        user: createUser(),
        showSensitizationPopup: false,
        loginIsCompleted: false,
        userUpdating: false,
      },
    }

    const store = configureStoreWithAuthUser({
      dependencies: {
        authUserGateway,
        authUserSensitizationStorage,
      },
      initialAppState,
    })

    const password = 'abcdefghi'
    const passwordConfirmation = 'abcdefghi'

    authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(false)
    authUserSensitizationStorage.setHasSeenPopup.mockReturnValueOnce()

    store.dispatch(publicActions.createPassword({ password, passwordConfirmation }))

    authUserGateway.definePassword.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectStep(store.getState())).toEqual(null)
    expect(selectLoginIsCompleted(store.getState())).toEqual(true)
  })

  it(`
    Given server return SMS Code needed on phone lookup
    When user trigger phone lookup
    Then step should be SMS Code after request succeeded
      And login should not be completed
  `, async () => {
    const authUserGateway = new TestAuthUserGateway()
    authUserGateway.phoneLookUp.mockDeferredValueOnce(PhoneLookUpResponse.SMS_CODE_NEEDED)

    const store = configureStoreWithAuthUser({ dependencies: { authUserGateway } })
    const phone = '0700000000'

    store.dispatch(publicActions.phoneLookUp(phone))

    authUserGateway.phoneLookUp.resolveDeferredValue()
    await store.waitForActionEnd()

    expect(selectStep(store.getState())).toEqual(LoginSteps.SMS_CODE)
    expect(selectLoginIsCompleted(store.getState())).toEqual(false)
  })

  it(`
    Given user as an account
    When user trigger phone lookup
    Then step should be password after request succeeded
      And login should not be completed
  `, async () => {
    const { store, resolveAllDeferredValue } = configureStoreWithUserAccount()

    const phone = '0700000000'
    store.dispatch(publicActions.phoneLookUp(phone))

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(selectStep(store.getState())).toEqual(LoginSteps.PASSWORD)
    expect(selectLoginIsCompleted(store.getState())).toEqual(false)
  })

  it(`
    Given user as an account
    When user want to reset password
    Then password reset request should be called once with phone number
      And next step should be SMS Code
      And login should not be completed
  `, async () => {
    const { store, resolveAllDeferredValue, authUserGateway } = configureStoreWithUserAccount()

    const phone = '0700000000'
    store.dispatch(publicActions.resetPassword({ phone }))

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(authUserGateway.resetPassword).toHaveBeenCalledTimes(1)
    expect(authUserGateway.resetPassword).toHaveBeenCalledWith({ phone })

    expect(selectStep(store.getState())).toEqual(LoginSteps.SMS_CODE)
    expect(selectLoginIsCompleted(store.getState())).toEqual(false)
  })

  it(`
    Given user as an account
    When user want to login with password
    Then user should be logging during request
      And user should be logged after request succeeded
      And user data should be equal to server response
      And there should not be a next step
      And login should be completed
      And user id should be set into Firebase
  `, async () => {
    const {
      store,
      resolveAllDeferredValue,
      user,
      authUserSensitizationStorage,
      firebaseService,
    } = configureStoreWithUserAccount()
    const phone = '0700000000'
    const password = 'abcdefghi'

    authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(false)
    authUserSensitizationStorage.setHasSeenPopup.mockReturnValueOnce()

    store.dispatch(publicActions.loginWithPassword({ phone, password }))

    // TODO
    // expect(selectIsLogging(store.getState())).toEqual(true)

    resolveAllDeferredValue()
    await store.waitForActionEnd()

    expect(selectIsLogged(store.getState())).toEqual(true)

    expect(selectUser(store.getState())).toEqual(user)

    expect(selectStep(store.getState())).toEqual(null)

    expect(selectLoginIsCompleted(store.getState())).toEqual(true)

    expect(firebaseService.setUser).toHaveBeenCalledWith(user.id.toString())
  })

  it(`
    Given user as an account
    When user want to login with SMS Code
    Then user should be logging during request
      And user should be logged after request succeeded
      And user data should be equal to server response
      And next step should be password creation
      And login should not be completed
      And user id should be set into Firebase
  `, async () => {
    const {
      store,
      resolveAllDeferredValue,
      user,
      authUserGateway,
      firebaseService,
    } = configureStoreWithUserAccount()
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
    expect(selectLoginIsCompleted(store.getState())).toEqual(false)
    expect(firebaseService.setUser).toHaveBeenCalledWith(user.id.toString())
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
          showSensitizationPopup: false,
          loginIsCompleted: false,
          userUpdating: false,
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

  describe('token storage', () => {
    it('should save user token with login from password', async () => {
      const user = createUser()

      const authUserTokenStorage = new TestAuthUserTokenStorage()
      const authUserSensitizationStorage = new TestAuthUserSensitizationStorage()
      const authUserGateway = new TestAuthUserGateway()
      authUserTokenStorage.setToken.mockReturnValueOnce()
      authUserGateway.loginWithPassword.mockDeferredValueOnce(user)

      const store = configureStoreWithAuthUser({
        dependencies: {
          authUserGateway,
          authUserTokenStorage,
          authUserSensitizationStorage,
        },
      })

      const phone = '0600000000'
      const password = 'xxx'

      authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(false)
      authUserSensitizationStorage.setHasSeenPopup.mockReturnValueOnce()

      store.dispatch(publicActions.loginWithPassword({ phone, password }))

      authUserGateway.loginWithPassword.resolveDeferredValue()
      await store.waitForActionEnd()

      expect(authUserTokenStorage.setToken).toHaveBeenNthCalledWith(1, user.token)
      expect(authUserTokenStorage.setToken).toHaveBeenCalledTimes(1)
    })

    it('should save user token with login from SMS code', async () => {
      const user = createUser()

      const authUserTokenStorage = new TestAuthUserTokenStorage()
      const authUserSensitizationStorage = new TestAuthUserSensitizationStorage()
      const authUserGateway = new TestAuthUserGateway()
      authUserTokenStorage.setToken.mockReturnValueOnce()
      authUserGateway.loginWithSMSCode.mockDeferredValueOnce(user)

      const store = configureStoreWithAuthUser({
        dependencies: {
          authUserGateway,
          authUserTokenStorage,
          authUserSensitizationStorage,
        },
      })

      const phone = '0600000000'
      const SMSCode = 'xxx'

      authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(false)
      authUserSensitizationStorage.setHasSeenPopup.mockReturnValueOnce()
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
    it(`
      Given initial state
      When user is automatically logged in
      Then the user should be set
        And login should be completed
        And the user id should be set into Firebase`, async () => {
      const authUserGateway = new TestAuthUserGateway()
      const authUserSensitizationStorage = new TestAuthUserSensitizationStorage()
      const firebaseService = new TestFirebaseService()
      const store = configureStoreWithAuthUser({
        dependencies: {
          authUserGateway,
          authUserSensitizationStorage,
          firebaseService,
        },
      })
      const user = createUser()

      authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(false)
      authUserSensitizationStorage.setHasSeenPopup.mockReturnValueOnce()
      firebaseService.setUser.mockReturnValueOnce()
      firebaseService.sendEvent.mockReturnValueOnce()

      store.dispatch(publicActions.setUser(user))
      await store.waitForActionEnd()
      expect(selectUser(store.getState())).toBeTruthy()
      expect(selectUser(store.getState())).toEqual(user)
      expect(selectLoginIsCompleted(store.getState())).toEqual(true)
      expect(firebaseService.setUser).toHaveBeenCalledWith(user.id.toString())
    })

    it(`
      Given initial state
      When user is logged out
      Then user should be set to null
        And login should not be completed
        And user id should be removed from Firebase
      `, async () => {
      const authUserGateway = new TestAuthUserGateway()
      const authUserSensitizationStorage = new TestAuthUserSensitizationStorage()
      const firebaseService = new TestFirebaseService()
      const user = createUser()

      const store = configureStoreWithAuthUser({
        initialAppState: {
          authUser: {
            user,
            ...defaultAuthUserState,
          },
        },
        dependencies: {
          authUserGateway,
          authUserSensitizationStorage,
          firebaseService,
        },
      })

      firebaseService.setUser.mockReturnValueOnce()
      firebaseService.sendEvent.mockReturnValueOnce()

      store.dispatch(publicActions.setUser(null))
      await store.waitForActionEnd()
      expect(selectUser(store.getState())).toBeFalsy()
      expect(selectUser(store.getState())).toEqual(null)
      expect(selectLoginIsCompleted(store.getState())).toEqual(false)
      expect(firebaseService.setUser).toHaveBeenCalledWith(undefined)
    })
  })

  // --------------------------------------------------

  describe('Sensitization workshop popup for non active users', () => {
    it(`
      Given initial state
      When no action is triggered
      Then sensitization workshop popup should not appear
    `, async () => {
      const authUserGateway = new TestAuthUserGateway()

      const store = configureStoreWithAuthUser({
        dependencies: { authUserGateway },
      })

      expect(selectShowSensitizationPopup(store.getState())).toBe(false)
    })

    it(`
      Given initial state
        And user has successfully created his account
      When user has successfully created his password
      Then sensitization workshop popup should appear
    `, async () => {
      const authUserGateway = new TestAuthUserGateway()
      const authUserSensitizationStorage = new TestAuthUserSensitizationStorage()
      authUserGateway.definePassword.mockDeferredValueOnce(null)

      const initialAppState = {
        authUser: {
          step: LoginSteps.CREATE_PASSWORD,
          errors: {},
          isLogging: false,
          user: createUser(true, false),
          showSensitizationPopup: false,
          loginIsCompleted: false,
          userUpdating: false,
        },
      }

      const store = configureStoreWithAuthUser({
        dependencies: {
          authUserGateway,
          authUserSensitizationStorage,
        },
        initialAppState,
      })

      const password = 'abcdefghi'
      const passwordConfirmation = 'abcdefghi'

      authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(false)

      store.dispatch(publicActions.createPassword({ password, passwordConfirmation }))

      authUserGateway.definePassword.resolveDeferredValue()
      await store.waitForActionEnd()

      expect(selectShowSensitizationPopup(store.getState())).toBe(true)
    })

    it(`
      Given initial state
      When the user has successfully logged in
        And the user has logged in for the first time
      Then the sensitization workshop popup should appear
    `, async () => {
      const {
        store,
        resolveAllDeferredValue,
        authUserSensitizationStorage,
      } = configureStoreWithUserAccount(true, false)
      const phone = '0700000000'
      const password = 'abcdefghi'

      authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(false)

      store.dispatch(publicActions.loginWithPassword({ phone, password }))

      resolveAllDeferredValue()
      await store.waitForActionEnd()

      expect(selectShowSensitizationPopup(store.getState())).toBe(true)
    })

    it(`
      Given initial state
      When the user has successfully logged in
        And the user has already logged in before
        And the user is not considered an active user
        And the user has not already seen the sensitization popup
      The sensitization workshop popup should appear
    `, async () => {
      const {
        store,
        resolveAllDeferredValue,
        authUserSensitizationStorage,
      } = configureStoreWithUserAccount(false, false)
      const phone = '0700000000'
      const password = 'abcdefghi'
      store.dispatch(publicActions.loginWithPassword({ phone, password }))

      authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(false)

      resolveAllDeferredValue()
      await store.waitForActionEnd()

      expect(selectShowSensitizationPopup(store.getState())).toBe(true)
    })

    it(`
      Given initial state
      When user is automatically logged in
        And the user is not considered an active user
        And the user has not already seen the sensitization popup
      Then sensitization workshop popup should appear
    `, async () => {
      const authUserGateway = new TestAuthUserGateway()
      const authUserSensitizationStorage = new TestAuthUserSensitizationStorage()
      const store = configureStoreWithAuthUser({ dependencies: { authUserGateway, authUserSensitizationStorage } })
      const user = createUser(false, false)

      authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(false)

      store.dispatch(publicActions.setUser(user))

      await store.waitForActionEnd()

      expect(selectShowSensitizationPopup(store.getState())).toBe(true)
    })

    it(`
      Given initial state
      When the user has successfully logged in
        And the user has already logged in before
        And the user is not considered an active user
        And the user has already seen the sensitization popup
      The sensitization workshop popup should not appear
    `, async () => {
      const {
        store,
        resolveAllDeferredValue,
        authUserSensitizationStorage,
      } = configureStoreWithUserAccount(false, false)
      const phone = '0700000000'
      const password = 'abcdefghi'
      store.dispatch(publicActions.loginWithPassword({ phone, password }))

      authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(true)

      resolveAllDeferredValue()
      await store.waitForActionEnd()

      expect(selectShowSensitizationPopup(store.getState())).toBe(false)
    })

    it(`
      Given initial state
      When user is automatically logged in
        And the user is not considered an active user
        And the user has already seen the sensitization popup
      Then sensitization workshop popup should not appear
    `, async () => {
      const authUserGateway = new TestAuthUserGateway()
      const authUserSensitizationStorage = new TestAuthUserSensitizationStorage()
      const store = configureStoreWithAuthUser({ dependencies: { authUserGateway, authUserSensitizationStorage } })
      const user = createUser(false, false)

      authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(true)

      store.dispatch(publicActions.setUser(user))

      await store.waitForActionEnd()

      expect(selectShowSensitizationPopup(store.getState())).toBe(false)
    })

    it(`
      Given initial state
      When the user has successfully logged in
        And the user is considered an active user
      The sensitization workshop popup should not appear
        And the local storage value hasSeenPopup for this specific user should be set to true
    `, async () => {
      const {
        store,
        resolveAllDeferredValue,
        authUserSensitizationStorage,
        user,
      } = configureStoreWithUserAccount(false, true)
      const phone = '0700000000'
      const password = 'abcdefghi'
      store.dispatch(publicActions.loginWithPassword({ phone, password }))

      authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(false)
      authUserSensitizationStorage.setHasSeenPopup.mockReturnValueOnce()

      resolveAllDeferredValue()
      await store.waitForActionEnd()

      expect(authUserSensitizationStorage.setHasSeenPopup).toHaveBeenNthCalledWith(1, user.id)
    })

    it(`
      Given initial state
      When user is automatically logged in
        And the user is considered an active user
      Then sensitization workshop popup should not appear
        And the local storage value hasSeenPopup for this specific user should be set to true
    `, async () => {
      const authUserGateway = new TestAuthUserGateway()
      const authUserSensitizationStorage = new TestAuthUserSensitizationStorage()
      const store = configureStoreWithAuthUser({ dependencies: { authUserGateway, authUserSensitizationStorage } })
      const user = createUser(false, true)

      authUserSensitizationStorage.getHasSeenPopup.mockReturnValueOnce(false)
      authUserSensitizationStorage.setHasSeenPopup.mockReturnValueOnce()

      store.dispatch(publicActions.setUser(user))

      await store.waitForActionEnd()

      expect(selectShowSensitizationPopup(store.getState())).toBe(false)
      expect(authUserSensitizationStorage.setHasSeenPopup).toHaveBeenNthCalledWith(1, user.id)
    })

    it(`
      Given initial state
        And the user is logged in
        And sensitization workshop popup has appeared
      When the user has interacted with it
      Then the popup should hide itself
        And the local storage value hasSeenPopup for this specific user should be set to true
    `, async () => {
      const authUserSensitizationStorage = new TestAuthUserSensitizationStorage()

      const user = createUser(false, false)

      const store = configureStoreWithAuthUser({
        initialAppState: {
          authUser: {
            ...defaultAuthUserState,
            user,
            showSensitizationPopup: true,
          },
        },
        dependencies: { authUserSensitizationStorage },

      })

      authUserSensitizationStorage.setHasSeenPopup.mockReturnValueOnce()

      store.dispatch(publicActions.hideSensitizationPopup())
      await store.waitForActionEnd()

      expect(authUserSensitizationStorage.setHasSeenPopup).toHaveBeenNthCalledWith(1, user.id)

      expect(selectShowSensitizationPopup(store.getState())).toBe(false)
    })
  })

  describe('Update user profile', () => {
    const user = createUser(false, false)

    const newUserData = {
      about: 'About test',
      avatarKey: '/avatar.png',
      email: 'test@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    }

    const updatedUser = {
      ...user,
      ...newUserData,
    }

    const newAddress = {
      googlePlaceId: 'placeId',
      googleSessionToken: '12345',
    }

    assertIsDefined(user.address)

    const updatedAddress = {
      ...user.address,
    }

    it(`
      Given initial state
         And user is logged in
      When no action is triggered
      Then the user should not be updating
  `, () => {
      const authUserGateway = new TestAuthUserGateway()

      const store = configureStoreWithAuthUser({
        initialAppState: {
          authUser: {
            ...defaultAuthUserState,
            user,
          },
          location: {
            ...defaultLocationState,
          },
        },
        dependencies: { authUserGateway },
      })

      expect(selectUserIsUpdating(store.getState())).toBe(false)
    })

    it(`
      Given initial state
        And user is logged in
      When user wants to update only his profile
      Then the user should be updating during request
        And the user should not be updating after request succeeded
        And the new user data should have been sent to the gateway
        And the update address gateway should not have been called
        And the user data should be updated
    `, async () => {
      const authUserGateway = new TestAuthUserGateway()

      const store = configureStoreWithAuthUser({
        initialAppState: {
          authUser: {
            ...defaultAuthUserState,
            user,
          },
          location: {
            ...defaultLocationState,
          },
        },
        dependencies: { authUserGateway },
      })

      authUserGateway.updateMe.mockDeferredValueOnce(updatedUser)
      authUserGateway.updateMeAddress.mockDeferredValueOnce(null)

      store.dispatch(publicActions.updateUser({
        ...newUserData,
      }))

      expect(selectUserIsUpdating(store.getState())).toBe(true)

      authUserGateway.updateMe.resolveDeferredValue()
      authUserGateway.updateMeAddress.resolveDeferredValue()

      await store.waitForActionEnd()

      expect(authUserGateway.updateMe).toHaveBeenCalledWith(newUserData)
      expect(authUserGateway.updateMeAddress).toHaveBeenCalledTimes(0)

      expect(selectUserIsUpdating(store.getState())).toBe(false)
      expect(selectUser(store.getState())).toStrictEqual(updatedUser)
    })

    it(`
      Given initial state
        And user is logged in
      When user wants to update his profile and address
      Then the user should be updating during request
        And the user should not be updating after request succeeded
        And the new user data should have been sent to the gateway
        And the new user address should have been sent to the gateway
        And the user data should be updated
        And the map position should be set to the user's new address
    `, async () => {
      const authUserGateway = new TestAuthUserGateway()

      const store = configureStoreWithAuthUser({
        initialAppState: {
          authUser: {
            ...defaultAuthUserState,
            user,
          },
          location: {
            ...defaultLocationState,
          },
        },
        dependencies: { authUserGateway },
      })

      authUserGateway.updateMe.mockDeferredValueOnce(updatedUser)
      authUserGateway.updateMeAddress.mockDeferredValueOnce(null)

      store.dispatch(publicActions.updateUser({
        ...newUserData,
        address: newAddress,
      }))

      expect(selectUserIsUpdating(store.getState())).toBe(true)

      authUserGateway.updateMe.resolveDeferredValue()
      authUserGateway.updateMeAddress.resolveDeferredValue()

      await store.waitForActionEnd()

      const { geolocation: defaultGeolocationData, ...defaultPositionData } = defaultLocationState
      const { isInit, ...restDefaultPositionData } = defaultPositionData

      expect(authUserGateway.updateMe).toHaveBeenCalledWith(newUserData)
      expect(authUserGateway.updateMeAddress).toHaveBeenCalledWith(newAddress)

      expect(selectUserIsUpdating(store.getState())).toBe(false)
      expect(selectUser(store.getState())).toStrictEqual(updatedUser)
      expect(selectLocation(store.getState())).toStrictEqual({
        ...restDefaultPositionData,
        center: {
          lat: updatedAddress.latitude,
          lng: updatedAddress.longitude,
        },
        displayAddress: updatedAddress.displayAddress,
      })
    })
  })
})
