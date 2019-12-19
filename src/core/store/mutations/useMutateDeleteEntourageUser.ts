import { useMutation } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from 'src/core/store'

type PathParams = Parameters<typeof schema['/entourages/:entourageId/users/:userId DELETE']['url']>[0]

export function useMutateDeleteEntourageUser() {
  return useMutation((pathParams: PathParams) => {
    return api.request({
      name: '/entourages/:entourageId/users/:userId DELETE',
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
