import { useQuery } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'

export function useQueryEntourage(entourageUuid?: string) {
  return useQuery(
    !entourageUuid ? null : [queryKeys.entourage, { entourageUuid }],
    (pathParams) => {
      return api.request({
        name: '/entourages/:entourageId GET',
        pathParams: {
          entourageUuid: pathParams.entourageUuid,
        },
      })
    },
  )
}
