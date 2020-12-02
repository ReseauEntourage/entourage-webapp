import { useSelector } from 'react-redux'
import { selectCurrentItem } from 'src/coreLogic/useCases/feed'

export function useCurrentFeedItem() {
  return useSelector(selectCurrentItem)
}
