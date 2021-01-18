import { jestFn } from '../../utils/jestFn'
import { IDeviceLocale } from './IDeviceLocale'

export class TestDeviceLocale implements IDeviceLocale {
  getDeviceLocale = jestFn<IDeviceLocale['getDeviceLocale']>('getDeviceLocale')
}
