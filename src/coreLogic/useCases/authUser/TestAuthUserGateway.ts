import { jestFn } from 'src/coreLogic/utils/jestFn'
import { IAuthUserGateway } from './IAuthUserGateway'

export class TestAuthUserGateway implements IAuthUserGateway {
  phoneLookUp = jestFn<IAuthUserGateway['phoneLookUp']>('phoneLookUp')

  resetPassword = jestFn<IAuthUserGateway['resetPassword']>('resetPassword')

  createAccount = jestFn<IAuthUserGateway['createAccount']>('createAccount')

  loginWithSMSCode = jestFn<IAuthUserGateway['loginWithSMSCode']>('loginWithSMSCode')

  loginWithPassword = jestFn<IAuthUserGateway['loginWithPassword']>('loginWithPassword')

  definePassword = jestFn<IAuthUserGateway['definePassword']>('definePassword')
}
