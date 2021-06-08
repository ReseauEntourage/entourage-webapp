import { api } from 'src/core/api'

export async function createAnonymousUser(): Promise<string> {
  const anonymousUsersRes = await api.request({
    name: '/anonymous_users POST',
  })

  return anonymousUsersRes.data.user.token
}
