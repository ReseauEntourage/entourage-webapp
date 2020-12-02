import { jestFn } from 'src/coreLogic/utils/jestFn'
import { IAuthUserTokenStorage } from './IAuthUserTokenStorage'

export class TestAuthUserTokenStorage implements IAuthUserTokenStorage {
  getToken = jestFn<IAuthUserTokenStorage['getToken']>('getToken')

  setToken = jestFn<IAuthUserTokenStorage['setToken']>('setToken')

  removeToken = jestFn<IAuthUserTokenStorage['removeToken']>('removeToken')
}
