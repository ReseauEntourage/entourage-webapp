import { useMutation } from 'react-query'
import { api, schema } from 'src/network/api'
import { queryKeys } from './queryKeys'

type PathParams = Parameters<typeof schema['PUT /entourages/:entourageId/users/:userId']['url']>[0]

export function useMutateAcceptEntourageUser() {
  return useMutation((pathParams: PathParams) => {
    return api.request({
      name: 'PUT /entourages/:entourageId/users/:userId',
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
