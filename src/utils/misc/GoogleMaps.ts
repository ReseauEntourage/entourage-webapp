import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { useMemo, useCallback, useState, useEffect } from 'react'
import { GoogleMapLocationValue } from 'src/components/GoogleMapLocation'
import { env } from 'src/core/env'
import { useStateGetter } from 'src/utils/hooks'

import { assertIsDefined, assertIsNumber, assertIsString, isSSR } from 'src/utils/misc'

const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query='

if (typeof window !== 'undefined') {
  setOptions({
    key: env.GOOGLE_MAP_API_KEY,
    v: 'weekly',
  })
}

let apiStatus: 'idle' | 'loading' | 'ready' | 'error' = 'idle'

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
        resolve(res as google.maps.places.PlaceResult)
      })
  })
}

export async function getLocationFromPlace(autocompletePlace: GoogleMapLocationValue) {
  assertIsDefined(autocompletePlace)

  const placeDetail = await getDetailPlacesService(
    autocompletePlace.place.place_id,
    autocompletePlace.sessionToken,
  )

  const latitude = placeDetail.geometry?.location?.lat()
  const longitude = placeDetail.geometry?.location?.lng()
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
        resolve(res as google.maps.GeocoderResult[])
      })
  })
}

export function useLoadGoogleMapApi() {
  const [status, setStatus] = useState(apiStatus)

  useEffect(() => {
    if (isSSR || apiStatus === 'ready' || apiStatus === 'error') {
      return
    }

    if (apiStatus === 'idle') {
      apiStatus = 'loading'
      setStatus('loading')

      importLibrary('places')
        .then(() => {
          apiStatus = 'ready'
          setStatus('ready')
        })
        .catch(() => {
          apiStatus = 'error'
          setStatus('error')
        })
    } else {
      // apiStatus is 'loading', we need to wait for it.
      // JS API Loader's `load()` function handles multiple calls gracefully
      // by returning the same promise.
      importLibrary('places')
        .then(() => setStatus('ready'))
        .catch(() => setStatus('error'))
    }
  }, [])

  if (status === 'idle' || status === 'loading') {
    return false
  }

  if (status === 'ready') {
    return true
  }

  throw new Error('Error during Google map loading')
}

export function useAutocompleteSessionToken() {
  if (apiStatus !== 'ready') {
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
  if (apiStatus !== 'ready') {
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

