import { plateform } from 'src/utils/misc'
import { MapContainerDesktop } from './MapContainer.desktop'
import { MapContainerMobile } from './MapContainer.mobile'

export interface MapContainerProps {
  markers: JSX.Element[];
  cards?: JSX.Element;
  list: JSX.Element;
  isLoading: boolean;
}

export const MapContainer = plateform({
  Desktop: MapContainerDesktop,
  Mobile: MapContainerMobile,
})
