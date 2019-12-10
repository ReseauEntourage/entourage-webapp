import { ChangeEventValue } from 'google-map-react'
import { createContext, useContext } from 'react'

export interface MapContextValue {
  onChange: (value: ChangeEventValue) => void;
  value: ChangeEventValue;
}

export const MapContext = createContext<MapContextValue>({} as MapContextValue)
export function useMapContext() {
  return useContext(MapContext)
}
