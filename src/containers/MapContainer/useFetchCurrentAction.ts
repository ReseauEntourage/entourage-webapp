import { useState, useEffect } from 'react'
import { useMapContext } from 'src/components/Map'
import { api } from 'src/core/api'
import { useActionId } from './useActionId'

export function useFetchCurrentAction() {
  const actionId = useActionId()
  const mapContext = useMapContext()
  const [fetchNeeded] = useState(actionId)
  const [isReady, setIsReady] = useState(!fetchNeeded)

  useEffect(() => {
    if (fetchNeeded && !isReady && actionId) {
      api.request({
        name: '/entourages/:entourageId GET',
        pathParams: {
          entourageUuid: actionId,
        },
      }).then((res) => {
        const { entourage } = res.data
        if (entourage) {
          mapContext.onChange((prev) => ({
            ...prev,
            center: {
              lat: entourage.location.latitude as number,
              lng: entourage.location.longitude as number,
            },
            cityName: entourage.metadata.city,
          }))
        }

        setIsReady(true)
      })
    }
  }, [actionId, fetchNeeded, isReady, mapContext])

  return isReady
}
