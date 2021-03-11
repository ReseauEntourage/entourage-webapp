import { useCallback, useState } from 'react'
import { useForm } from '../../components/Form'
import { useAutocompleteSessionToken } from '../misc'
import { AnyToFix } from '../types'
import { GeolocationService } from 'src/adapters/services/GeolocationService'
import { AutocompleteFormFieldKey, PlaceType } from 'src/components/GoogleMapLocation'

export function useGetCurrentPosition<T>(fields: T, defaultAddress?: string) {
  const [displayAddress, setDisplayAddress] = useState(defaultAddress)
  const { getSessionToken, regenerateSessionToken } = useAutocompleteSessionToken()

  const form = useForm<T>({
    defaultValues: {
      ...fields,
    },
  })

  const { setValue } = form

  const getCurrentLocation = useCallback(async () => {
    try {
      const geolocationService = new GeolocationService()
      const { coordinates } = await geolocationService.getGeolocation()
      const { placeAddress, googlePlaceId } = await geolocationService.getPlaceAddressFromCoordinates(coordinates, true)
      const sessionToken = getSessionToken()
      regenerateSessionToken()

      if (googlePlaceId) {
        setValue(AutocompleteFormFieldKey, {
          sessionToken,
          place: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            place_id: googlePlaceId,
          } as PlaceType,
        } as AnyToFix)
        setDisplayAddress(placeAddress ?? undefined)
      }
    } catch (error) {
      // Do nothing
    }
  }, [getSessionToken, regenerateSessionToken, setValue])

  return { displayAddress, setDisplayAddress, getCurrentLocation, form }
}
