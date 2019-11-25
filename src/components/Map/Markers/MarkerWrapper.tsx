// This component is use to wrap Marker because Google map required a custom component
interface Props {
  children: JSX.Element;
  lat: number;
  lng: number;
}

export function MarkerWrapper({ children }: Props) {
  return children
}
