import { NextPageContext } from 'next'
import { parseCookies, setCookie } from 'nookies'
import { constants } from 'src/constants'

export function getLocaleFromCookies(ctx?: NextPageContext): string | null {
  return parseCookies(ctx)[constants.LOCALE_KEY]
}

export function setLocaleIntoCookies(locale: string, ctx?: NextPageContext): void {
  setCookie(ctx, constants.LOCALE_KEY, locale, {
    path: '/',
  })
}
