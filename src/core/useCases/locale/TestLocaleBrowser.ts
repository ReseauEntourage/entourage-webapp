import { jestFn } from '../../utils/jestFn'
import { ILocaleBrowser } from './ILocaleBrowser'

export class TestLocaleBrowser implements ILocaleBrowser {
  getBrowserLocale = jestFn<ILocaleBrowser['getBrowserLocale']>('getBrowserLocale')
}
