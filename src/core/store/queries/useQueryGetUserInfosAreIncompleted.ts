import { useRef, useCallback } from 'react'
import { useQueryIAmLogged } from './useQueryIAmLogged'
import { useQueryMe } from './useQueryMe'

export function useQueryGetUserInfosAreIncompleted(): () => boolean {
  const userInfosAreIncompletedRef = useRef(false)
  const { iAmLogged } = useQueryIAmLogged()
  const me = useQueryMe()

  if (iAmLogged) {
    const { firstName, lastName, address, hasPassword } = me.data?.data.user ?? {}
    userInfosAreIncompletedRef.current = !!hasPassword && (!firstName || !lastName || !address)
  }

  return useCallback(() => userInfosAreIncompletedRef.current, [])
}
