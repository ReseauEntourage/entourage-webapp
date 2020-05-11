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
