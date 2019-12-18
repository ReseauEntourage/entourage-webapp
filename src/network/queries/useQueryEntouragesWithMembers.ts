import { useQuery } from 'react-query'
import { api, FeedJoinStatus } from 'src/network/api'
import { queryKeys } from './queryKeys'

export function useQueryEntouragesWithMembers(entourageIdList: number[] | undefined, memberStatus?: FeedJoinStatus) {
  const { data: entourageMembers } = useQuery(
    entourageIdList ? [queryKeys.entourageUsers, { entourageIdList }] : null,
    (params) => {
      return Promise.all(params.entourageIdList.map(async (entourageId) => {
        const members = await api.request({
          name: 'GET /entourages/:entourageId/users',
          pathParams: {
            entourageId,
          },
          params: {
            context: 'groupFeed',
          },
        })

        return {
          members,
          entourageId,
        }
      }))
    },
  )

  if (!entourageMembers) {
    return {
      members: [],
      isLoading: true,
    }
  }

  let entouragesWithMembers = entourageMembers
    .map((data) => ({
      entourageId: data.entourageId,
      members: data.members.data.users,
    }))

  if (memberStatus) {
    entouragesWithMembers = entouragesWithMembers.filter((entourage) => ({
      entourageId: entourage.entourageId,
      members: entourage.members.filter((member) => member.status === memberStatus),
    }))
  }

  return {
    entouragesWithMembers,
    isLoading: false,
  }
}

export type DataUseQueryEntouragesWithMembers = ReturnType<
  typeof useQueryEntouragesWithMembers
>['entouragesWithMembers']
