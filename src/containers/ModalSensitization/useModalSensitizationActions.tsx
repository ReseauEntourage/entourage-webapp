import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useModalContext } from 'src/components/Modal'
import { authUserActions } from 'src/core/useCases/authUser'
import { useFirebase } from 'src/utils/hooks'

export function useModalSensitizationActions() {
  const { onClose } = useModalContext()
  const { sendEvent } = useFirebase()
  const dispatch = useDispatch()

  const onDismissWithFeedback = useCallback((dismissReason: string) => {
    sendEvent('Action__Workshop__Dismiss', {
      value: dismissReason,
    })
    onClose()
    dispatch(authUserActions.hideSensitizationPopup())
  }, [dispatch, onClose, sendEvent])

  const onDismiss = useCallback(() => {
    sendEvent('Action__Workshop__Dismiss')
    onClose()
    dispatch(authUserActions.hideSensitizationPopup())
  }, [dispatch, onClose, sendEvent])

  const onWorkshopClick = useCallback(() => {
    sendEvent('Action__Workshop__Participate')
    onClose()
    dispatch(authUserActions.hideSensitizationPopup())
  }, [dispatch, onClose, sendEvent])

  return { onDismiss, onDismissWithFeedback, onWorkshopClick }
}
