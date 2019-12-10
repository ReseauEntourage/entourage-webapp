import React from 'react'
import { useMapContext } from '../context'
import { constants } from 'src/constants'
import { colors } from 'src/styles'
import { getPixelPerMeter } from 'src/utils'
import { BaseMarker } from './BaseMarker'

function getMarkerSize(lat: number, zoom: number) {
  const MIN_PX_SIZE = 30
  const pixelPerMeter = getPixelPerMeter(lat, zoom)
  const size = pixelPerMeter * constants.MARKER_DIAMETER

  return size < MIN_PX_SIZE
    ? MIN_PX_SIZE
    : size
}

interface Props {
  isActive: boolean;
}

// disable ESLint because lat and lng are internaly use by Google Map
// eslint-disable-next-line
export function EventMarker(props: Props) {
  const { isActive } = props
  const { zoom, center: { lat } } = useMapContext().value
  const size = getMarkerSize(lat, zoom)

  return (
    <BaseMarker size={size}>
      <div
        style={{
          position: 'relative',
          display: 'block',
          height: size,
          width: size,
          borderRadius: '50%',
          backgroundColor: isActive ? colors.main.red : colors.main.marker,
          opacity: isActive ? 1 : 0.7,
          cursor: 'pointer',
          zIndex: isActive ? 2 : 1,
        }}
      />
    </BaseMarker>
  )
}
