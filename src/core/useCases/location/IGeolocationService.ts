import { LocationState } from './location.reducer'

export interface IGeolocationService {
  getGeolocation(): Promise<{
    coordinates: LocationState['center'];
  }>;

  getPlaceAddressFromCoordinates(coordinates: google.maps.LatLngLiteral, getGooglePlaceId?: boolean): Promise<{
    placeAddress: LocationState['displayAddress'] | null;
    googlePlaceId: google.maps.GeocoderResult['place_id'] | null;
  }>;
}
