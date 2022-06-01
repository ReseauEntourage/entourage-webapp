import { useMemo, useCallback } from 'react'
import { GoogleMapLocationValue } from 'src/components/GoogleMapLocation'
import { env } from 'src/core/env'
import { useStateGetter } from 'src/utils/hooks'
import { assertIsDefined, assertIsNumber, assertIsString, isSSR, useScript, useScriptIsReady } from 'src/utils/misc'

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

export async function getLocationFromPlace(autocompletePlace: GoogleMapLocationValue) {
  assertIsDefined(autocompletePlace)

  const placeDetail = await getDetailPlacesService(
    autocompletePlace.place.place_id,
    autocompletePlace.sessionToken,
  )

  const latitude = placeDetail.geometry?.location.lat()
  const longitude = placeDetail.geometry?.location.lng()
  const googlePlaceId = autocompletePlace.place.place_id
  const streetAddress = placeDetail.formatted_address
  const placeName = placeDetail.name

  assertIsNumber(latitude)
  assertIsNumber(longitude)
  assertIsString(streetAddress)

  return {
    location: {
      latitude,
      longitude,
    },
    googlePlaceId,
    streetAddress,
    placeName,
  }
}

export function getDetailPlacesFromCoordinatesService(
  coordinates: google.maps.LatLngLiteral,
): Promise<google.maps.GeocoderResult[]> {
  const requestGetDetail: google.maps.GeocoderRequest = {
    location: coordinates,
  }

  return new Promise((resolve) => {
    new google.maps.Geocoder()
      .geocode(requestGetDetail, (res) => {
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

