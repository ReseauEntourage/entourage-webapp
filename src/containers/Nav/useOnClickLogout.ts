import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setTokenIntoCookies, createAnonymousUser } from 'src/core/services'
import { authUserActions } from 'src/core/useCases/authUser'
import { notificationsActions } from 'src/core/useCases/notifications'

export function useOnClickLogout() {
  const dispatch = useDispatch()

  return useCallback(async () => {
    setTokenIntoCookies('')
    try {
      await createAnonymousUser()
    } catch (err) {
      dispatch(notificationsActions.addAlert({ message: err.message, severity: 'error' }))
    }
    dispatch(authUserActions.setUser(null))
  }, [dispatch])
}
