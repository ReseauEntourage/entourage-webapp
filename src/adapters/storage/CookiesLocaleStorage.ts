// import { NextPageContext } from 'next'
import { ILocaleStorage } from '../../core/useCases/locale'
import { Locale } from '../../core/useCases/locale/locale.reducer'
import { getLocaleFromCookies, setLocaleIntoCookies } from 'src/core/services'

export class CookiesLocaleStorage implements ILocaleStorage {
  getSavedLocale(): Locale | null {
    return getLocaleFromCookies()
  }

  storeLocale(locale: Locale): void | null {
    setLocaleIntoCookies(locale)
  }
}
