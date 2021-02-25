import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useModalContext } from 'src/components/Modal'
import { authUserActions } from 'src/core/useCases/authUser'
import { useFirebase } from 'src/utils/hooks'

export function useModalSensitizationActions() {
  const { onClose } = useModalContext()
  const { sendActionWorkshopDismiss, sendActionWorkshopParticipate } = useFirebase()
  const dispatch = useDispatch()

  const onDismissWithFeedback = useCallback((dismissReason: string) => {
    sendActionWorkshopDismiss({
      value: dismissReason,
    })
    onClose()
    dispatch(authUserActions.hideSensitizationPopup())
  }, [dispatch, onClose, sendActionWorkshopDismiss])

  const onDismiss = useCallback(() => {
    sendActionWorkshopDismiss()
    onClose()
    dispatch(authUserActions.hideSensitizationPopup())
  }, [dispatch, onClose, sendActionWorkshopDismiss])

  const onWorkshopClick = useCallback(() => {
    sendActionWorkshopParticipate()
    onClose()
    dispatch(authUserActions.hideSensitizationPopup())
  }, [dispatch, onClose, sendActionWorkshopParticipate])

  return { onDismiss, onDismissWithFeedback, onWorkshopClick }
}
