import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useModalContext } from 'src/components/Modal'
import { authUserActions } from 'src/core/useCases/authUser'

export function useModalSensitizationActions() {
  const { onClose } = useModalContext()
  const dispatch = useDispatch()

  const onDismissWithFeedback = useCallback((dismissReason: string) => {
    // TODO send event to Firebase with value
    // TODO https://entourage-asso.atlassian.net/browse/EN-3466

    // eslint-disable-next-line no-console
    console.log(dismissReason)
    onClose()
    dispatch(authUserActions.hideSensitizationPopup())
  }, [dispatch, onClose])

  const onDismiss = useCallback(() => {
    // TODO send event to Firebase
    // TODO https://entourage-asso.atlassian.net/browse/EN-3466
    onClose()
    dispatch(authUserActions.hideSensitizationPopup())
  }, [dispatch, onClose])

  const onWorkshopClick = useCallback(() => {
    // TODO https://entourage-asso.atlassian.net/browse/EN-3466
    onClose()
    dispatch(authUserActions.hideSensitizationPopup())
  }, [dispatch, onClose])

  return { onDismiss, onDismissWithFeedback, onWorkshopClick }
}
