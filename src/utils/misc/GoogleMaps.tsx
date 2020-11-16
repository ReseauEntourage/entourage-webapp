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

type GoogleMapState = {
  autoCompleteService: google.maps.places.AutocompleteService;
  isReady: true;
  sessionToken: ReturnType<typeof createAutocompleteSessionToken>;
} | {
  autoCompleteService: undefined;
  isReady: false;
  sessionToken: undefined;
}

let instance: GoogleMapState = {
  autoCompleteService: undefined,
  isReady: false,
  sessionToken: undefined,
}

const onLoaded = () => {
  if (!isSSR && !instance.isReady) {
    const googleMapInst = window.google?.maps
    instance = {
      autoCompleteService: new googleMapInst.places.AutocompleteService(),
      isReady: true,
      sessionToken: createAutocompleteSessionToken(),
    }
  }
}

export const GoogleMapApi = {
  onLoaded,
  getInstance: () => instance,
}
