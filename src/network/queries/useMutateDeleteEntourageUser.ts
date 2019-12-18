import { useMutation } from 'react-query'
import { api, schema } from 'src/network/api'
import { assertIsDefined } from 'src/utils'
import { queryKeys } from './queryKeys'
import { useQueryMe } from './useQueryMe'

type FullPathParams = Parameters<typeof schema['DELETE /entourages/:entourageId/users/:userId']['url']>[0]
type PathParams = Omit<FullPathParams, 'userId'>

export function useMutateDeleteEntourageUser() {
  const { data: me } = useQueryMe()

  return useMutation((pathParams: PathParams) => {
    const userId = me?.data.user.id

    assertIsDefined(userId, 'useMutateDeleteEntourageUser must have userId')

    return api.request({
      name: 'DELETE /entourages/:entourageId/users/:userId',
      pathParams: {
        userId,
        entourageId: pathParams.entourageId,
      },
    })
  }, {
    refetchQueries: [queryKeys.feeds],
  })
}
