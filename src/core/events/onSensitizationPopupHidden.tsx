import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectShowSensitizationPopup } from 'src/core/useCases/authUser'
import { usePrevious } from 'src/utils/hooks'

export function useOnSensitizationPopupHidden(onSensitizationHidden: () => void) {
  const showSensitizationPopup = useSelector(selectShowSensitizationPopup)

  const prevShowSensitizationPopup = usePrevious(showSensitizationPopup)

  useEffect(() => {
    if (prevShowSensitizationPopup && !showSensitizationPopup) {
      onSensitizationHidden()
    }
  }, [prevShowSensitizationPopup, showSensitizationPopup, onSensitizationHidden])
}
