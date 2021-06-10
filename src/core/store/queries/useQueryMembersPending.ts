import { useMeNonNullable } from 'src/hooks/useMe'
import { useQueryEntouragesWithMembers } from './useQueryEntouragesWithMembers'

export function useQueryMembersPending(entourageUuid: string) {
  const me = useMeNonNullable()
  const { entouragesWithMembers } = useQueryEntouragesWithMembers('pending')

  if (!entouragesWithMembers) {
    return {
      isLoading: true,
      membersPending: [],
    }
  }

  const currentEntourage = entouragesWithMembers.find((entourage) => entourage.entourageUuid === entourageUuid)

  const members = currentEntourage?.members ?? []

  const filteredMembers = members.filter((member) => member.id !== me.id)

  return {
    isLoading: false,
    membersPending: filteredMembers,
  }
}
