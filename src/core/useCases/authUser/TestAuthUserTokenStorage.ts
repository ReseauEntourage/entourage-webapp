import { jestFn } from 'src/core/utils/jestFn'
import { IAuthUserTokenStorage } from './IAuthUserTokenStorage'

export class TestAuthUserTokenStorage implements IAuthUserTokenStorage {
  getToken = jestFn<IAuthUserTokenStorage['getToken']>('getToken')

  setToken = jestFn<IAuthUserTokenStorage['setToken']>('setToken')
}
