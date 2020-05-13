import GoogleMapReact from 'google-map-react'
import React, { useState, useCallback } from 'react'
import { constants } from 'src/constants'
import { env } from 'src/core/env'
import { AnyToFix } from 'src/utils/types'
import { MapContextValue, MapContext, useMapContext } from './context'

interface Props {
  /**
   * It's possible to have multiple map children, like {data.map(obj => (<div />))} .
   * Need to find the correct type
   */
  children: AnyToFix;
  onChange?: (value: MapContextValue) => void;
}

const defaultValues = {
  center: constants.DEFAULT_LOCATION.CENTER,
  zoom: constants.DEFAULT_LOCATION.ZOOM,
} as MapContextValue['value']

export function Map(props: Props) {
  const { children } = props
  const { onChange, value } = useMapContext()

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: env.GOOGLE_MAP_API_KEY }}
      center={value.center}
      defaultCenter={constants.DEFAULT_LOCATION.CENTER}
      defaultZoom={constants.DEFAULT_LOCATION.ZOOM}
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
