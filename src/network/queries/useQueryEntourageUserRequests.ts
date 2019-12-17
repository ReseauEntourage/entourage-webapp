import { useQuery } from 'react-query'
import { api } from 'src/network/api'
import { queryKeys } from './queryKeys'

export function useQueryEntourageUserRequestsList(entourageIdList: number[] | undefined) {
  const { data: dataUsers, isLoading } = useQuery(
    entourageIdList ? [queryKeys.entourageUsers, { entourageIdList }] : null,
    (params) => {
      return Promise.all(params.entourageIdList.map(async (entourageId) => {
        const users = await api.request({
          name: 'GET /entourages/:entourageId/users',
          pathParams: {
            entourageId,
          },
          params: {
            context: 'groupFeed',
          },
        })

        return {
          users,
          entourageId,
        }
      }))
    },
  )

  return [dataUsers || [], isLoading] as [NonNullable<typeof dataUsers>, boolean]
}
