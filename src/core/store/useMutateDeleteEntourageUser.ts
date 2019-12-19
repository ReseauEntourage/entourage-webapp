import { useMutation } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from './queryKeys'

type PathParams = Parameters<typeof schema['DELETE /entourages/:entourageId/users/:userId']['url']>[0]

export function useMutateDeleteEntourageUser() {
  return useMutation((pathParams: PathParams) => {
    return api.request({
      name: 'DELETE /entourages/:entourageId/users/:userId',
      pathParams: {
        userId: pathParams.userId,
        entourageId: pathParams.entourageId,
      },
    })
  }, {
    refetchQueries: [
      queryKeys.feeds,
      queryKeys.entourageUsers,
    ],
  })
}
