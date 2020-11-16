import React, { useState, createContext, useContext, useCallback, useEffect } from 'react'
import { env } from 'src/core/env'
import { useScript } from 'src/utils/hooks'
import { isSSR } from 'src/utils/misc'

export function getDetailPlacesService(placeId: string, sessionToken: string): Promise<google.maps.places.PlaceResult> {
  const requestGetDetail = {
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

export function createAutocompleteSessionToken(): { Rf: string; } {
  // @ts-ignore
  return new google.maps.places.AutocompleteSessionToken()
}

type GoogleMapValue = {
  autoCompleteService: google.maps.places.AutocompleteService;
  isReady: true;
  sessionToken: ReturnType<typeof createAutocompleteSessionToken>;
} | {
  autoCompleteService: undefined;
  isReady: false;
  sessionToken: undefined;
}

const GoogleMapContext = createContext<GoogleMapValue>({
  autoCompleteService: undefined,
  isReady: false,
  sessionToken: undefined,
})

export function useGoogleMapContext() {
  return useContext(GoogleMapContext)
}

interface ProviderProps {
  children: React.ReactChild;
}

export function GoogleMapProvider(props: ProviderProps) {
  const { children } = props
  const scriptStatus = useScript(`https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAP_API_KEY}
  &libraries=places`)

  const [googleMap, setGoogleMap] = useState<GoogleMapValue>({
    autoCompleteService: undefined,
    isReady: false,
    sessionToken: undefined,
  })

  const checkStatus = useCallback(() => {
    return scriptStatus === 'ready' && !isSSR && !googleMap.isReady
  }, [scriptStatus, googleMap.isReady])

  useEffect(() => {
    if (checkStatus()) {
      const googleMapInst = window.google?.maps
      setGoogleMap({
        autoCompleteService: new googleMapInst.places.AutocompleteService(),
        isReady: true,
        sessionToken: createAutocompleteSessionToken(),
      })
    }
  }, [checkStatus])

  return (
    <GoogleMapContext.Provider value={googleMap}>
      {children}
    </GoogleMapContext.Provider>
  )
}
