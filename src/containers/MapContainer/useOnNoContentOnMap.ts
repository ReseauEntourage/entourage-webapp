import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { openModal } from 'src/components/Modal'
import { selectIsLogged, selectShowSensitizationPopup, selectUserInfosAreIncomplete } from 'src/core/useCases/authUser'
import { usePrevious } from 'src/utils/hooks'

export function useOnNoContentOnMap(
  fetching: boolean,
  hasCurrentItem: boolean,
  modal: React.ReactElement,
) {
  const isLogged = useSelector(selectIsLogged)
  const userInfosAreIncompleted = useSelector(selectUserInfosAreIncomplete)
  const showSensitizationPopup = useSelector(selectShowSensitizationPopup)

  const shouldShowAnotherPopup = isLogged && (showSensitizationPopup || userInfosAreIncompleted)

  const prevFetching = usePrevious(fetching)

  return useCallback(() => {
    if (
      !shouldShowAnotherPopup
      && !fetching
      && prevFetching
      && !hasCurrentItem) {
      openModal(modal)
    }
  }, [shouldShowAnotherPopup, fetching, prevFetching, hasCurrentItem, modal])
}
