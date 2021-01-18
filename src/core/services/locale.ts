import { NextPageContext } from 'next'
import { parseCookies, setCookie } from 'nookies'
import { Locale } from '../useCases/locale/locale.reducer'
import { constants } from 'src/constants'

export function getLocaleFromCookies(ctx?: NextPageContext): Locale | null {
  return parseCookies(ctx)[constants.LOCALE_KEY] as Locale
}

export function setLocaleIntoCookies(locale: Locale, ctx?: NextPageContext): void {
  setCookie(ctx, constants.LOCALE_KEY, locale, {
    path: '/',
  })
}
