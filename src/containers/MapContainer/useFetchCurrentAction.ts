import { useState, useEffect } from 'react'
import { useMapContext } from 'src/components/Map'
import { useQueryEntourage } from 'src/core/store'
import { useActionId } from './useActionId'

export function useFetchCurrentAction() {
  const actionId = useActionId()
  const [fetchNeeded] = useState(actionId)
  const mapContext = useMapContext()
  const [isReady, setIsReady] = useState(!fetchNeeded)

  const entourageRes = useQueryEntourage(fetchNeeded ? actionId : undefined)

  useEffect(() => {
    if (fetchNeeded && !isReady) {
      const entourage = entourageRes.data?.data.entourage
      if (entourage) {
        mapContext.onChange((prev) => ({
          ...prev,
          center: {
            lat: entourage.location.latitude as number,
            lng: entourage.location.longitude as number,
          },
          cityName: entourage.metadata.city,
        }))
        setIsReady(true)
      }
    }
  }, [entourageRes.data, fetchNeeded, isReady, mapContext])

  return isReady
}
