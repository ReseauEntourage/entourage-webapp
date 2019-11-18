import Cookies from 'js-cookie'
import { constants } from 'src/constants'

export function getTokenFromCookies(): string | void {
  return Cookies.get(constants.AUTH_TOKEN_KEY)
}

export function setTokenIntoCookies(authToken: string): void {
  return Cookies.set(constants.AUTH_TOKEN_KEY, authToken)
}
