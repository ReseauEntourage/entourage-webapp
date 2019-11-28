import { NextPageContext } from 'next'
import { api } from '../api'
import { setTokenIntoCookies } from './authToken'

export async function createAnonymousUser(ctx?: NextPageContext): Promise<string> {
  const anonymousUsersRes = await api.request({
    routeName: 'POST /anonymous_users',
  })

  const anonymousToken = anonymousUsersRes.data.user.token

  setTokenIntoCookies(anonymousToken, ctx)

  return anonymousToken
}
