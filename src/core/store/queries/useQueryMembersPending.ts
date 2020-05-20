import { assertIsDefined } from 'src/utils/misc'
import { useQueryEntouragesWithMembers } from './useQueryEntouragesWithMembers'

export function useQueryMembersPending(entourageUuid: string) {
  const { entouragesWithMembers } = useQueryEntouragesWithMembers('pending')

  if (!entouragesWithMembers) {
    return {
      isLoading: true,
      membersPending: [],
    }
  }

  const currentEntourage = entouragesWithMembers.find((entourage) => entourage.entourageUuid === entourageUuid)

  assertIsDefined(currentEntourage)

  return {
    isLoading: false,
    membersPending: currentEntourage.members,
  }
}
