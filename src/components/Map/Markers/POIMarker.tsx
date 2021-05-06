import React from 'react'
import { useSelector } from 'react-redux'
import { POICategory } from 'src/core/api'
import { selectMapPosition } from 'src/core/useCases/location'
import { getMarkerSize, roundToEven } from 'src/utils/misc'

import { BaseMarker } from './BaseMarker'
import { POIIcon } from './POIIcon'

interface Props {
  category: POICategory;
  isActive: boolean;
  tooltip?: string;
}

export function POIMarker(props: Props) {
  const { category, isActive, tooltip } = props
  const { zoom } = useSelector(selectMapPosition)
  const size = getMarkerSize(zoom)

  const displaySize = isActive ? size * 2 : roundToEven(size)

  return (
    <BaseMarker size={displaySize}>
      <POIIcon
        isActive={isActive}
        poiCategory={category}
        size={size}
        tooltip={tooltip}
      />
    </BaseMarker>
  )
}
