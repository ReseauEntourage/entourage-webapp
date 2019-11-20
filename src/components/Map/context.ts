import { createContext, useContext } from 'react'
import { ChangeEventValue } from 'google-map-react'

export interface MapContextValue extends ChangeEventValue {}

export const MapContext = createContext<MapContextValue>({} as MapContextValue)
export function useMapContext() {
  return useContext(MapContext)
}
