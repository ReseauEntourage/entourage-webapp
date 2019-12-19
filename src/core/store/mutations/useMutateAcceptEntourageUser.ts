import { useMutation } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from 'src/core/store'

type PathParams = Parameters<typeof schema['/entourages/:entourageId/users/:userId PUT']['url']>[0]

export function useMutateAcceptEntourageUser() {
  return useMutation((pathParams: PathParams) => {
    return api.request({
      name: '/entourages/:entourageId/users/:userId PUT',
      pathParams: {
        userId: pathParams.userId,
        entourageId: pathParams.entourageId,
      },
      data: {
        user: {
          status: 'accepted',
        },
      },
    })
  }, {
    refetchQueries: [
      queryKeys.feeds,
      queryKeys.entourageUsers,
    ],
  })
}
