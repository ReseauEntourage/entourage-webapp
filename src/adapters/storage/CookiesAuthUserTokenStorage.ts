// import { NextPageContext } from 'next'
import { getTokenFromCookies, setTokenIntoCookies } from 'src/core/services'
import { IAuthUserTokenStorage } from 'src/core/useCases/authUser'

export class CookiesAuthUserTokenStorage implements IAuthUserTokenStorage {
  // constructor(private nextContext: NextPageContext) {}

  setToken(token: string) {
    setTokenIntoCookies(token)
  }

  getToken() {
    return getTokenFromCookies()
  }

  removeToken() {
    this.setToken('')
  }
}
