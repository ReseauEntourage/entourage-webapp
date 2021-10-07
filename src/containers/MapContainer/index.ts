import { plateform } from 'src/utils/misc'
import { MapContainerDesktop } from './MapContainer.desktop'
import { MapContainerMobile } from './MapContainer.mobile'

export * from './useActionId'
export * from './useNextFeed'
export * from './MapActions'

export * from './usePOIId'
export * from './usePOIs'
export * from './MapPOIs'

export interface MapContainerProps {
  markers: JSX.Element[];
  cards?: JSX.Element;
  list: JSX.Element;
  filters?: JSX.Element;
  isLoading: boolean;
  onNoContentOnMap: () => void;
}

export const MapContainer = plateform({
  Desktop: MapContainerDesktop,
  Mobile: MapContainerMobile,
})
