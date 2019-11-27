import { NextPageContext } from 'next'
import { api } from '../api'
import { setTokenIntoCookies } from './authToken'

export async function createAnonymousUser(ctx: NextPageContext): Promise<string> {
  const anonymousUsersRes = await api.request({
    routeName: 'POST anonymous_users',
  })

  const anonymousToken = anonymousUsersRes.data.user.token

  setTokenIntoCookies(anonymousToken, ctx)

  return anonymousToken
}

// export async function autoLoginOnStart() {
//   try {
//     const localToken = getTokenFromCookies()

//     console.log('localToken', localToken)

//     if (localToken) {
//       try {
//         await api.request({
//           routeName: 'GET users/me',
//         })
//       } catch (e) {
//         await loginAnonymousUser()
//       }
//     } else {
//       await loginAnonymousUser()
//     }
//   } catch (e) {
//     console.error(e)
//     throw new Error('LOGIN_FAILED')
//   }
// }
