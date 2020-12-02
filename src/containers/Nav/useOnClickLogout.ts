import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setTokenIntoCookies, createAnonymousUser } from 'src/core/services'
import { authUserActions } from 'src/coreLogic/useCases/authUser'

export function useOnClickLogout() {
  const dispatch = useDispatch()

  return useCallback(async () => {
    setTokenIntoCookies('')
    await createAnonymousUser()
    dispatch(authUserActions.setUser(null))
  }, [dispatch])
}
