import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectFeedIsFetching, selectFeedItems } from 'src/coreLogic/useCases/feed'
import { useDelayLoading, usePrevious } from 'src/utils/hooks'

export function useNextFeed() {
  const feedsLoading = useSelector(selectFeedIsFetching)
  const plainFeeds = useSelector(selectFeedItems)
  const prevFeedsLoading = usePrevious(feedsLoading)
  const lastFeedsRef = useRef<typeof plainFeeds>()
  const [isLoading, setIsLoading] = useDelayLoading()

  if (!feedsLoading) {
    lastFeedsRef.current = plainFeeds
  }

  useEffect(() => {
    if (prevFeedsLoading && !feedsLoading) {
      setIsLoading(false)
    } else if (feedsLoading && !prevFeedsLoading) {
      setIsLoading(true)
    }
  }, [feedsLoading, prevFeedsLoading, setIsLoading])

  const feeds = feedsLoading ? (lastFeedsRef.current || []) : plainFeeds

  return { feeds, isLoading }
}
