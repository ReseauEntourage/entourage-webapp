import { useCallback } from 'react'
import { refetchQuery } from 'react-query'
import { setTokenIntoCookies, createAnonymousUser } from 'src/core/services'
import { queryKeys } from 'src/core/store'

export function useOnClickLogout() {
  return useCallback(async () => {
    setTokenIntoCookies('')
    await createAnonymousUser()
    refetchQuery(queryKeys.me, { force: true })
  }, [])
}
