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

type GoogleMapState = {
  autoCompleteService: google.maps.places.AutocompleteService;
  isReady: true;
} | {
  autoCompleteService: undefined;
  isReady: false;
}

let instance: GoogleMapState = {
  autoCompleteService: undefined,
  isReady: false,
}

const onLoaded = () => {
  if (!isSSR && !instance.isReady) {
    const googleMapInst = window.google?.maps
    instance = {
      autoCompleteService: new googleMapInst.places.AutocompleteService(),
      isReady: true,
    }
  }
}

export const GoogleMapApi = {
  onLoaded,
  getInstance: () => instance,
}

export function createAutocompleteSessionToken(): { Rf: string; } | undefined {
  const { isReady } = GoogleMapApi.getInstance()
  // @ts-ignore
  return isReady ? new google.maps.places.AutocompleteSessionToken() : undefined
}
