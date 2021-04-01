import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'src/components/Form'
import { AutocompleteFormFieldKey, PlaceType } from 'src/components/GoogleMapLocation'
import { locationActions, selectGeolocation } from 'src/core/useCases/location'
import { useAutocompleteSessionToken } from 'src/utils/misc'
import { AnyToFix } from 'src/utils/types'

export function useGetCurrentPosition<T>(fields: T, defaultAddress?: string) {
  const [displayAddress, setDisplayAddress] = useState(defaultAddress)
  const { getSessionToken, regenerateSessionToken } = useAutocompleteSessionToken()
  const dispatch = useDispatch()
  const geolocation = useSelector(selectGeolocation)
  const isFirstRun = useRef(true)

  const form = useForm<T>({
    defaultValues: {
      ...fields,
    },
  })

  const { setValue } = form

  const getCurrentLocation = useCallback(async () => {
    dispatch(locationActions.getGeolocation({
      updateLocationFilter: false,
    }))
  }, [dispatch])

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    if (geolocation?.googlePlaceId) {
      const sessionToken = getSessionToken()
      regenerateSessionToken()
      setValue(AutocompleteFormFieldKey, {
        sessionToken,
        place: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          place_id: geolocation.googlePlaceId,
        } as PlaceType,
      } as AnyToFix)

      setDisplayAddress(geolocation.displayAddress ?? undefined)
    }
  }, [geolocation, getSessionToken, regenerateSessionToken, setValue])

  return { displayAddress, setDisplayAddress, getCurrentLocation, form }
}
