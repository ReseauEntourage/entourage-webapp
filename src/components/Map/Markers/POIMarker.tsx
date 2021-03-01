import React from 'react'
import { useSelector } from 'react-redux'
import { POICategory } from 'src/core/api'
import { selectLocation } from 'src/core/useCases/location'
import { roundToEven } from 'src/utils/misc'
import { BaseMarker } from './BaseMarker'
import { POIIcon } from './POIIcon'

function getSize(zoom: number): number {
  if (zoom < 12) {
    return 16
  }
  if (zoom >= 12 && zoom < 15) {
    return 24
  }
  return 32
}

interface Props {
  category: POICategory['id'];
  isActive: boolean;
  tooltip?: string;
}

export function POIMarker(props: Props) {
  const { category, isActive, tooltip } = props
  const { zoom } = useSelector(selectLocation)
  const size = getSize(zoom)

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
