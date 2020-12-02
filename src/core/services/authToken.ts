import { NextPageContext } from 'next'
import { parseCookies, setCookie } from 'nookies'
import { constants } from 'src/constants'

export function getTokenFromCookies(ctx?: NextPageContext): string | null {
  return parseCookies(ctx)[constants.AUTH_TOKEN_KEY]
}

export function setTokenIntoCookies(authToken: string, ctx?: NextPageContext): void {
  setCookie(ctx, constants.AUTH_TOKEN_KEY, authToken, {
    maxAge: constants.AUTH_TOKEN_TTL,
    path: '/',
  })
}
