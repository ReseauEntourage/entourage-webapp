import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { authUserActions } from 'src/core/useCases/authUser'

export function useOnClickLogout() {
  const dispatch = useDispatch()

  return useCallback(async () => {
    dispatch(authUserActions.logout())
  }, [dispatch])
}
