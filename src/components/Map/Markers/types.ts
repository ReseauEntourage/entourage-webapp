
// props required by Google Map
// but also optional because if there is a wrapper between <Map> and the marker,
// then lat and lng are required by the wrapper
export interface MarkerProps {
  lat?: number;
  lng?: number;
}
