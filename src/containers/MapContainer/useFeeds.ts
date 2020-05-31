import { useRef, useEffect } from 'react'
import { useQueryFeeds } from 'src/core/store'
import { useDelayLoading, usePrevious } from 'src/utils/hooks'

export function useFeeds() {
  const [plainFeeds, feedsLoading] = useQueryFeeds()
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
