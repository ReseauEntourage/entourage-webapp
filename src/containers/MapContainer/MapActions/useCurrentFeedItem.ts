import { useSelector } from 'react-redux'
import { selectCurrentItem } from 'src/core/useCases/feed'

export function useCurrentFeedItem() {
  return useSelector(selectCurrentItem)
}
