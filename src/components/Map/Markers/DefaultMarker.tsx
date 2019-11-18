import React from 'react'
import { Location } from 'src/api'
import { styles } from 'src/styles'

interface Props {
  lat: Location['latitude'];
  lng: Location['longitude'];
  type: 'default';
}

// disable ESLint because lat and lng are use by Google Map
// eslint-disable-next-line
export function DefaultMarker(props: Props) {
  return (
    <div
      style={{
        display: 'block',
        height: 30,
        width: 30,
        borderRadius: '50%',
        backgroundColor: styles.colors.marker,
        opacity: 0.7,
        cursor: 'pointer',
      }}
    />
  )
}
