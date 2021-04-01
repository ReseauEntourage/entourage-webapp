import { jestFn } from '../../utils/jestFn'
import { IFirebaseService } from './IFirebaseService'

export class TestFirebaseService implements IFirebaseService {
  sendEvent = jestFn<IFirebaseService['sendEvent']>('sendEvent')

  setUser = jestFn<IFirebaseService['setUser']>('setUser')
}
