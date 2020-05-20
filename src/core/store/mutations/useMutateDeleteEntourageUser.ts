import { useMutation } from 'react-query'
import { api } from 'src/core/api'
import { queryKeys } from 'src/core/store'

interface PathParams {
  entourageUuid: string;
  userId: number;
}

export function useMutateDeleteEntourageUser() {
  return useMutation((pathParams: PathParams) => {
    return api.request({
      name: '/entourages/:entourageId/users/:userId DELETE',
      pathParams: {
        userId: pathParams.userId,
        entourageUuid: pathParams.entourageUuid,
      },
    })
  }, {
    refetchQueries: [
      queryKeys.feeds,
      queryKeys.entourageUsers,
    ],
  })
}
