import { useQuery } from 'react-query'
import { useSSRDataContext } from 'src/core/SSRDataContext'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'

export function useQueryMe() {
  const SSRData = useSSRDataContext()

  const meData = useQuery(
    queryKeys.me,
    () => {
      return api.request({
        name: '/users/me GET',
      })
    },
    {
      // @ts-ignore
      initialData: SSRData.me,
    },
  )

  return meData
}
