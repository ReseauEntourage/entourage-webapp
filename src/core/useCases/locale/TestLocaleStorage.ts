import { jestFn } from '../../utils/jestFn'
import { ILocaleStorage } from './ILocaleStorage'

export class TestLocaleStorage implements ILocaleStorage {
  getSavedLocale = jestFn<ILocaleStorage['getSavedLocale']>('getSavedLocale')

  storeLocale = jestFn<ILocaleStorage['storeLocale']>('storeLocale')
}
