import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { openModal } from 'src/components/Modal'
import { ModalNoContentProps, ModalNoContent } from 'src/containers/ModalNoContent'
import {
  selectHasNoSetupPopupToShow,
} from 'src/core/useCases/authUser'
import { usePrevious } from 'src/utils/hooks'

export function useOnNoContentOnMap(
  fetching: boolean,
  hasCurrentItem: boolean,
  modalProps: ModalNoContentProps,
) {
  const hasNoSetupPopupToShow = useSelector(selectHasNoSetupPopupToShow)

  const prevFetching = usePrevious(fetching)

  return useCallback(() => {
    if (
      hasNoSetupPopupToShow
      && !fetching
      && prevFetching
      && !hasCurrentItem) {
      openModal(<ModalNoContent {...modalProps} />)
    }
  }, [hasNoSetupPopupToShow, fetching, prevFetching, hasCurrentItem, modalProps])
}
