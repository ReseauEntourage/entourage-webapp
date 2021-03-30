import { Tooltip } from '@material-ui/core'
import SvgIcon from '@material-ui/core/SvgIcon'
import React from 'react'
import { useSelector } from 'react-redux'
import { Event } from 'src/assets'
import { selectLocation } from 'src/core/useCases/location'
import { colors } from 'src/styles'
import { getMarkerSize, roundToEven } from 'src/utils/misc'
import { BaseMarker } from './BaseMarker'

interface Props {
  isActive: boolean;
  tooltip: string;
}

// disable ESLint because lat and lng are internally use by Google Map
// eslint-disable-next-line
export function EventMarker(props: Props) {
  const { isActive, tooltip } = props
  const position = useSelector(selectLocation)
  const { zoom } = position
  const size = getMarkerSize(zoom)

  const displaySize = isActive ? size * 2 : roundToEven(size)

  const fontSize = roundToEven(displaySize / 1.6)

  const { width, height } = Event().props

  return (
    <BaseMarker size={size}>
      <Tooltip title={tooltip}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: displaySize,
            width: displaySize,
            borderRadius: '50%',
            backgroundColor: colors.main.white,
            border: `solid 1px ${colors.main.primary}`,
            cursor: 'pointer',
            zIndex: isActive ? 2 : 1,
          }}
        >
          <SvgIcon
            component={Event}
            style={{
              color: colors.main.primary,
              fontSize,
            }}
            viewBox={`0 0 ${width} ${height}`}
          />
        </div>
      </Tooltip>
    </BaseMarker>
  )
}
