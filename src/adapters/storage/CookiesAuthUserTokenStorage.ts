import { NextPageContext } from 'next'
import { parseCookies, setCookie } from 'nookies'
import { constants } from 'src/constants'
import { createAnonymousUser } from 'src/core/services'
import { IAuthUserTokenStorage } from 'src/core/useCases/authUser'

export class CookiesAuthUserTokenStorage implements IAuthUserTokenStorage {
  static authToken = ''

  static async initToken(ctx?: NextPageContext): Promise<void> {
    const token = CookiesAuthUserTokenStorage.getTokenFromCookie(ctx) || await createAnonymousUser()
    CookiesAuthUserTokenStorage.setToken(token, ctx)
  }

  static getTokenFromCookie(ctx?: NextPageContext): string | null {
    return parseCookies(ctx)[constants.AUTH_TOKEN_KEY]
  }

  static setToken(authToken: string, ctx?: NextPageContext): void {
    setCookie(ctx, constants.AUTH_TOKEN_KEY, authToken, {
      maxAge: constants.AUTH_TOKEN_TTL,
      path: '/',
    })
    CookiesAuthUserTokenStorage.authToken = authToken
  }

  setToken(token: string) {
    CookiesAuthUserTokenStorage.setToken(token)
  }

  getToken(ctx?: NextPageContext) {
    return CookiesAuthUserTokenStorage.getTokenFromCookie(ctx)
  }
}
