import { assertIsDefined } from 'src/utils'
import { useQueryMyFeeds } from './useQueryMyFeeds'

export function useQueryEntourageFromMyFeeds(entourageId: number) {
  const { data: myFeedsData } = useQueryMyFeeds()
  const entourage = myFeedsData?.data.feeds.find((feed) => feed.data.id === entourageId)

  assertIsDefined(entourage)

  return entourage.data
}
