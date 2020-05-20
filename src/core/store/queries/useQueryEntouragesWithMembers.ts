import { useQuery } from 'react-query'
import { api, FeedJoinStatus } from 'src/core/api'
import { queryKeys } from 'src/core/store'
import { useQueryMyFeeds } from './useQueryMyFeeds'

export function useQueryEntouragesWithMembers(memberStatus?: FeedJoinStatus) {
  const { data: dataMyFeeds } = useQueryMyFeeds()
  const entourageUuids = dataMyFeeds?.map((feed) => feed.data.uuid)

  const { data: entourageMembers } = useQuery(
    entourageUuids ? [queryKeys.entourageUsers, { entourageUuids }] : null,
    (params) => {
      return Promise.all(params.entourageUuids.map(async (entourageUuid) => {
        const members = await api.request({
          name: '/entourages/:entourageId/users GET',
          pathParams: {
            entourageUuid,
          },
          params: {
            context: 'groupFeed',
          },
        })

        return {
          members,
          entourageUuid,
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
      entourageUuid: data.entourageUuid,
      members: data.members.data.users,
    }))

  if (memberStatus) {
    entouragesWithMembers = entouragesWithMembers.map((entourage) => ({
      entourageUuid: entourage.entourageUuid,
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
