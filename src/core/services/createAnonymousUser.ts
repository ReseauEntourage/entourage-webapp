import { NextPageContext } from 'next'
import { api } from 'src/core/api'
import { setTokenIntoCookies } from './authToken'

export async function createAnonymousUser(ctx?: NextPageContext): Promise<string> {
  const anonymousUsersRes = await api.request({
    name: '/anonymous_users POST',
  })

  const anonymousToken = anonymousUsersRes.data.user.token

  setTokenIntoCookies(anonymousToken, ctx)

  return anonymousToken
}
