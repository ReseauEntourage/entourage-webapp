import { plateform } from 'src/utils/misc'
import { MapContainerDesktop } from './MapContainer.desktop'
import { MapContainerMobile } from './MapContainer.mobile'

export const MapContainer = plateform({
  Desktop: MapContainerDesktop,
  Mobile: MapContainerMobile,
})
