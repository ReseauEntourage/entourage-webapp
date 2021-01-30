import { useSelector } from 'react-redux'
import { selectPOIList } from 'src/core/useCases/pois'

export function usePOIs() {
  return useSelector(selectPOIList)
}
