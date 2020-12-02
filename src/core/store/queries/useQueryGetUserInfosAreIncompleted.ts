import { useRef, useCallback } from 'react'
import { useMe } from 'src/hooks/useMe'

export function useQueryGetUserInfosAreIncompleted(): () => boolean {
  const userInfosAreIncompletedRef = useRef(false)
  const me = useMe()

  if (me) {
    const { firstName, lastName, address, hasPassword } = me
    userInfosAreIncompletedRef.current = !!hasPassword && (!firstName || !lastName || !address)
  }

  return useCallback(() => userInfosAreIncompletedRef.current, [])
}
