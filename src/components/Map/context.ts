import { ChangeEventValue } from 'google-map-react'
import { SetStateAction, createContext, useContext } from 'react'

interface MapContextValueValue extends ChangeEventValue {
  cityName: string;
}

export interface MapContextValue {
  onChange: (value: SetStateAction<MapContextValueValue>) => void;
  value: MapContextValueValue;
}

export const MapContext = createContext<MapContextValue>({} as MapContextValue)
export function useMapContext() {
  return useContext(MapContext)
}
