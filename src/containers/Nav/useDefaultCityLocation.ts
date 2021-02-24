import { useRouter } from 'next/router'
import { Cities, EntourageCities } from 'src/utils/types'

export function useDefaultCityLocation() {
  const router = useRouter()
  const actionId = router.query.actionId as string
  const poiId = router.query.poiId as string

  const queryId = actionId ?? poiId ?? null

  return EntourageCities[queryId as Cities]
}
