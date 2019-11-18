import { api } from '../api'
import { getTokenFromCookies, setTokenIntoCookies } from './authToken'

async function loginAnonymousUser() {
  const anonymousUsersRes = await api.request({
    routeName: 'POST anonymous_users',
  })

  const anonymousToken = anonymousUsersRes.data.user.token
  setTokenIntoCookies(anonymousToken)
}

export async function autoLoginOnStart() {
  try {
    const localToken = getTokenFromCookies()

    if (localToken) {
      try {
        await api.request({
          routeName: 'GET users/me',
        })
      } catch (e) {
        await loginAnonymousUser()
      }
    } else {
      await loginAnonymousUser()
    }
  } catch (e) {
    console.error(e)
    throw new Error('LOGIN_FAILED')
  }
}
