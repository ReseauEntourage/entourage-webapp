import GoogleMapReact from 'google-map-react'
import React, { useState, useCallback } from 'react'
import { env } from 'src/core/env'
import { AnyToFix } from 'src/utils/types'
import { MapContextValue, MapContext, useMapContext } from './context'

const Paris = {
  center: {
    lat: 48.856491799999986,
    lng: 2.334808400000014,
  },
  zoom: 13,
}

interface Props {
  /**
   * It's possible to have multiple map children, like {data.map(obj => (<div />))} .
   * Need to find the correct type
   */
  children: AnyToFix;
  onChange?: (value: MapContextValue) => void;
}

const defaultValues = Paris as MapContextValue['value']

export function Map(props: Props) {
  const { children } = props
  const { onChange } = useMapContext()

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: env.GOOGLE_MAP_API_KEY }}
      defaultCenter={defaultValues.center}
      defaultZoom={defaultValues.zoom}
      onChange={onChange}
      yesIWantToUseGoogleMapApiInternals={true}
    >
      {children}
    </GoogleMapReact>
  )
}

export function MapProvider(props: { children: JSX.Element; }) {
  const { children } = props
  const [mapContextValue, setMapContextValue] = useState<MapContextValue['value']>(defaultValues)

  const onChange = useCallback(setMapContextValue, [])

  const context = {
    value: mapContextValue,
    onChange,
  }

  return (
    <MapContext.Provider value={context}>
      {children}
    </MapContext.Provider>
  )
}
