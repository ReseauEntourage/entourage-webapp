import { ChangeEventValue } from 'google-map-react'
import { SetStateAction, createContext, useContext } from 'react'

export interface MapContextValue {
  onChange: (value: SetStateAction<ChangeEventValue>) => void;
  value: ChangeEventValue;
}

export const MapContext = createContext<MapContextValue>({} as MapContextValue)
export function useMapContext() {
  return useContext(MapContext)
}
