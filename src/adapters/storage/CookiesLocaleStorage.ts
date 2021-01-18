// import { NextPageContext } from 'next'
import { ILocaleStorage } from '../../core/useCases/locale'
import { getLocaleFromCookies, setLocaleIntoCookies } from 'src/core/services'

export class CookiesLocaleStorage implements ILocaleStorage {
  getSavedLocale(): string | null {
    return getLocaleFromCookies()
  }

  storeLocale(locale: string): void | null {
    setLocaleIntoCookies(locale)
  }
}
