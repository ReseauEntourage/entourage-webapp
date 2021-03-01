import { useSelector } from 'react-redux'
import { selectCurrentFeedItem } from 'src/core/useCases/feed'

export function useCurrentFeedItem() {
  return useSelector(selectCurrentFeedItem)
}
