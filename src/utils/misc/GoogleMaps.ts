import { useMemo, useCallback } from 'react'
import { useStateGetter } from '../hooks'
import { env } from 'src/core/env'
import { isSSR, useScript, useScriptIsReady } from 'src/utils/misc'

const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAP_API_KEY}&libraries=places`

const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query='

class GoogleMapApiNotLoaded extends Error {
  name = 'Google Map Api is not loaded'
}

export function getDetailPlacesService(
  placeId: string,
  sessionToken: google.maps.places.AutocompleteSessionToken,
): Promise<google.maps.places.PlaceResult> {
  const requestGetDetail: google.maps.places.PlaceDetailsRequest = {
    placeId,
    sessionToken,
    fields: ['name', 'place_id', 'geometry', 'formatted_address'],
  }

  return new Promise((resolve) => {
    new google.maps.places.PlacesService(document.createElement('div'))
      .getDetails(requestGetDetail, (res) => {
        resolve(res)
      })
  })
}

export function useLoadGoogleMapApi() {
  const url = !isSSR
    ? scriptUrl
    : ''

  const status = useScript(url)

  if (status === 'idle' || status === 'loading') {
    return false
  }

  if (status === 'ready') {
    return true
  }

  throw new Error('Error during Google map loading')
}

export function useAutocompleteSessionToken() {
  if (!useScriptIsReady(scriptUrl)) {
    throw new GoogleMapApiNotLoaded()
  }

  const [, setSessionToken, getSessionToken] = useStateGetter(new google.maps.places.AutocompleteSessionToken())

  const regenerateSessionToken = useCallback(() => {
    setSessionToken(new google.maps.places.AutocompleteSessionToken())
  }, [setSessionToken])

  return useMemo(() => {
    return {
      getSessionToken,
      regenerateSessionToken,
    }
  }, [getSessionToken, regenerateSessionToken])
}

export function useAutocompleteServices() {
  if (!useScriptIsReady(scriptUrl)) {
    throw new GoogleMapApiNotLoaded()
  }

  return useMemo(() => {
    return new google.maps.places.AutocompleteService()
  }, [])
}

export function getLinkFromCoordinates(lat: number, lng: number) {
  return `${googleMapsUrl}${lat},${lng}`
}

export function getUrlFromAddress(address: string) {
  return `${googleMapsUrl}${encodeURI(address)}`
}

