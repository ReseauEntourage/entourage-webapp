// import { assertIsDefined } from 'src/utils/misc'
import { useQueryMyFeeds } from './useQueryMyFeeds'

export function useQueryEntourageFromMyFeeds(entourageUuid: string) {
  const { data: myFeedsData } = useQueryMyFeeds()
  const entourage = myFeedsData?.find((feed) => feed.data.uuid === entourageUuid)

  // assertIsDefined(entourage)

  return entourage?.data
}
