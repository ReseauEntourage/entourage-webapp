import { useQuery } from 'react-query'
import { api, FeedJoinStatus } from 'src/network/api'
import { queryKeys } from './queryKeys'
import { useQueryMyFeeds } from './useQueryMyFeeds'

export function useQueryEntouragesWithMembers(memberStatus?: FeedJoinStatus) {
  const { data: dataMyFeeds } = useQueryMyFeeds()
  const entourageIds = dataMyFeeds?.data.feeds.map((feed) => feed.data.id)

  const { data: entourageMembers } = useQuery(
    entourageIds ? [queryKeys.entourageUsers, { entourageIds }] : null,
    (params) => {
      return Promise.all(params.entourageIds.map(async (entourageId) => {
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
    entouragesWithMembers = entouragesWithMembers.map((entourage) => ({
      entourageId: entourage.entourageId,
      // strange bug from TypeScript as he know member type
      // @ts-ignore
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
