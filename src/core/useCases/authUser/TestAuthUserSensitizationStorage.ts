import { jestFn } from 'src/core/utils/jestFn'
import { IAuthUserSensitizationStorage } from './IAuthUserSensitizationStorage'

export class TestAuthUserSensitizationStorage implements IAuthUserSensitizationStorage {
  getHasSeenPopup = jestFn<IAuthUserSensitizationStorage['getHasSeenPopup']>('getHasSeenPopup')

  setHasSeenPopup = jestFn<IAuthUserSensitizationStorage['setHasSeenPopup']>('setHasSeenPopup')
}
