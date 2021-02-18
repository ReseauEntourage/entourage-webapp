import { useSelector } from 'react-redux'
import { selectCurrentPOI } from 'src/core/useCases/pois'

export function useCurrentPOI() {
  return useSelector(selectCurrentPOI)
}
