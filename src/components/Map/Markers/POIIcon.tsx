import { Tooltip } from '@material-ui/core'

import SvgIcon from '@material-ui/core/SvgIcon'
import React from 'react'
import { POICategory } from 'src/core/api'
import { colors } from 'src/styles'
import { roundToEven, poiIcons, poiLabels } from 'src/utils/misc'

interface POIIconProps {
  poiCategory: POICategory;
  size?: number;
  isActive?: boolean;
  tooltip?: string;
}

export function POIIcon(props: POIIconProps) {
  const { poiCategory, size = 22, isActive = false, tooltip } = props
  const color = colors.pois[poiCategory ?? 0] ?? colors.pois[0]
  const Icon = poiIcons[poiCategory ?? 0] ?? poiIcons[0]
  const label = poiLabels[poiCategory ?? 0] ?? poiLabels[0]

  const displaySize = isActive ? size * 2 : roundToEven(size)

  const fontSize = roundToEven(displaySize / 1.4)

  const { width, height } = Icon({}).props

  return (
    <Tooltip title={tooltip || label}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: displaySize,
          width: displaySize,
          borderRadius: '50%',
          backgroundColor: color,
          cursor: 'pointer',
          zIndex: isActive ? 2 : 1,
        }}
      >
        <SvgIcon
          component={Icon}
          style={{
            color: colors.main.white,
            fontSize,
          }}
          viewBox={`0 0 ${width} ${height}`}
        />
      </div>
    </Tooltip>
  )
}
