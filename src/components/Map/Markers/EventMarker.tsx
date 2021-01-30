import { Tooltip } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectPosition } from '../../../core/useCases/position'
import { constants } from 'src/constants'
import { colors } from 'src/styles'
import { getPixelPerMeter } from 'src/utils/misc'
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
  tooltip?: string;
}

// disable ESLint because lat and lng are internally use by Google Map
// eslint-disable-next-line
export function EventMarker(props: Props) {
  const { isActive, tooltip } = props
  const position = useSelector(selectPosition)
  const { zoom, center: { lat } } = position
  const size = getMarkerSize(lat, zoom)

  const marker = (
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
  )

  const tooltipMarker = (
    <Tooltip title={tooltip}>
      {marker}
    </Tooltip>
  )

  return (
    <BaseMarker size={size}>
      {tooltip ? tooltipMarker : marker}
    </BaseMarker>
  )
}
