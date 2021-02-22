import { LocationState } from './location.reducer'

export interface IGeolocationService {
  getGeolocation(): Promise<{
    coordinates: LocationState['center'];
  }>;

  getPlaceAddressFromCoordinates(coordinates: google.maps.LatLngLiteral): Promise<{
    placeAddress: LocationState['displayAddress'] | null;
  }>;
}
