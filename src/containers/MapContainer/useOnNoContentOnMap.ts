import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { openModal } from 'src/components/Modal'
import { selectShowSensitizationPopup } from 'src/core/useCases/authUser'
import { usePrevious } from 'src/utils/hooks'

export function useOnNoContentOnMap(
  fetching: boolean,
  hasCurrentItem: boolean,
  modal: React.ReactElement,
) {
  const showSensitizationPopup = useSelector(selectShowSensitizationPopup)
  const prevFetching = usePrevious(fetching)

  return useCallback(() => {
    if (
      !showSensitizationPopup
      && !fetching
      && prevFetching
      && !hasCurrentItem) {
      openModal(modal)
    }
  }, [hasCurrentItem, fetching, modal, prevFetching, showSensitizationPopup])
}
