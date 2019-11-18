import React from 'react'
import GoogleMapReact from 'google-map-react'
import { env } from 'src/core/env'
import { Container } from './Map.styles'

const Paris = {
  lat: 48.8564918,
  lng: 2.3348084,
  zoom: 12.85,
}

interface Props {}

export function Map() {
  const center = {
    lat: Paris.lat,
    lng: Paris.lng,
  }

  const { zoom } = Paris

  return (
    <Container>
      <GoogleMapReact
        bootstrapURLKeys={{ key: env.GOOGLE_MAP_API_KEY }}
        defaultCenter={center}
        defaultZoom={zoom}
      />
    </Container>
  )
}
