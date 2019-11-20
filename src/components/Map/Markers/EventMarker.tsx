import React from 'react'
import { styles } from 'src/styles'
import { getPixelPerMeter } from 'src/utils'
import { constants } from 'src/constants'
import { useMapContext } from '../context'
import { BaseMarker } from './BaseMarker'
import { MarkerProps } from './types'

function getMarkerSize(lat: number, zoom: number) {
  const MIN_PX_SIZE = 30
  const pixelPerMeter = getPixelPerMeter(lat, zoom)
  const size = pixelPerMeter * constants.MARKER_DIAMETER

  return size < MIN_PX_SIZE
    ? MIN_PX_SIZE
    : size
}

interface Props extends MarkerProps {}

// disable ESLint because lat and lng are internaly use by Google Map
// eslint-disable-next-line
export function EventMarker(props: Props) {
  const { zoom, center: { lat } } = useMapContext()
  const size = getMarkerSize(lat, zoom)

  return (
    <BaseMarker size={size}>
      <div
        style={{
          display: 'block',
          height: size,
          width: size,
          borderRadius: '50%',
          backgroundColor: styles.colors.marker,
          opacity: 0.7,
          cursor: 'pointer',
        }}
      />
    </BaseMarker>
  )
}
