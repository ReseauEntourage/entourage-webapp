import { useQuery } from 'react-query'
import { api, LoggedUser } from 'src/network/api'
import { assertIsDefined } from 'src/utils/misc'
import { queryKeys } from './queryKeys'

export function useQueryMeNonNullable() {
  const { data } = useQuery(queryKeys.me, () => api.request({
    name: 'GET /users/me',
  }))

  assertIsDefined(data?.data.user, 'useQueryMeNonNullable error')
  assertIsDefined(data?.data.user.id, 'useQueryMeNonNullable user id error')

  return data.data.user as LoggedUser
}

export type DataUseQueryMeNonNullable = ReturnType<typeof useQueryMeNonNullable>
