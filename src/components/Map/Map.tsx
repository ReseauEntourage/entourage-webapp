import React, { useState } from 'react'
import GoogleMapReact from 'google-map-react'
import { env } from 'src/core'
import { AnyToFix } from 'src/types'
import { MapContextValue, MapContext } from './context'

const Paris = {
  center: {
    lat: 48.8564918,
    lng: 2.3348084,
  },
  zoom: 12.85,
}

interface Props {
  /**
   * It's possible to have multiple map children, like {data.map(obj => (<div />))} .
   * Need to find the correct type
   */
  children: AnyToFix;
}

const defaultValues = Paris

export function Map(props: Props) {
  const { children } = props
  const [mapContextValue, setMapContextValue] = useState<MapContextValue>({ center: {} } as MapContextValue)

  return (
    <MapContext.Provider value={mapContextValue}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: env.GOOGLE_MAP_API_KEY }}
        defaultCenter={defaultValues.center}
        defaultZoom={defaultValues.zoom}
        yesIWantToUseGoogleMapApiInternals={true}
        onChange={setMapContextValue}
      >
        {children}
      </GoogleMapReact>
    </MapContext.Provider>
  )
}
