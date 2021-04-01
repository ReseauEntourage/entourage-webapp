import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { firebaseActions } from 'src/core/useCases/firebase'
import { FirebaseProps, FirebaseEvent } from 'src/utils/types'

export function useFirebase() {
  const dispatch = useDispatch()

  const sendEvent = useCallback((event: FirebaseEvent, props?: FirebaseProps) => {
    dispatch(firebaseActions.sendFirebaseEvent({ event, props }))
  }, [dispatch])

  return { sendEvent }
}
