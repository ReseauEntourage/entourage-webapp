import { useMutation } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'

interface PathParams {
  entourageUuid: string;
  userId: number;
}

export function useMutateAcceptEntourageUser() {
  return useMutation((pathParams: PathParams) => {
    return api.request({
      name: '/entourages/:entourageId/users/:userId PUT',
      pathParams: {
        userId: pathParams.userId,
        entourageUuid: pathParams.entourageUuid,
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
