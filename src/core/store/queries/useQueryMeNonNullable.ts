import { useQuery } from 'react-query'
import { api, LoggedUser } from 'src/core/api'
import { queryKeys } from 'src/core/store'
import { assertIsDefined } from 'src/utils/misc'

export function useQueryMeNonNullable() {
  const { data } = useQuery(queryKeys.me, () => api.request({
    name: '/users/me GET',
  }))

  assertIsDefined(data?.data.user, 'useQueryMeNonNullable error')
  assertIsDefined(data?.data.user.id, 'useQueryMeNonNullable user id error')

  return data.data.user as LoggedUser
}

export type DataUseQueryMeNonNullable = ReturnType<typeof useQueryMeNonNullable>
