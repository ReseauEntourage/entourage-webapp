import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { api, FeedJoinStatus } from 'src/core/api'
import { queryKeys } from 'src/core/store'
import { selectConversationList } from 'src/core/useCases/messages'

export function useQueryEntouragesWithMembers(memberStatus?: FeedJoinStatus) {
  const conversationList = useSelector(selectConversationList)
  const entourageUuids = conversationList.map((conversation) => conversation.uuid)

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
