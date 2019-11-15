import { api } from '../api'
import { getTokenFromCookies, setTokenIntoCookies } from './authToken'

async function loginAnonymousUser() {
  const anonymousUsersRes = await api.anonymousUser()
  const anonymousToken = anonymousUsersRes.data.user.token
  setTokenIntoCookies(anonymousToken)
}

export async function autoLoginOnStart() {
  try {
    const localToken = getTokenFromCookies()

    if (localToken) {
      try {
        await api.userMeGet()
      } catch (e) {
        await loginAnonymousUser()
      }
    } else {
      await loginAnonymousUser()
    }
  } catch (e) {
    throw new Error('LOGIN_FAILED')
  }
}
