import AddBoxIcon from '@material-ui/icons/AddBox'
import ExploreIcon from '@material-ui/icons/Explore'
import HomeIcon from '@material-ui/icons/Home'
import LocalDrinkIcon from '@material-ui/icons/LocalDrink'
import PeopleIcon from '@material-ui/icons/People'
import RestaurantIcon from '@material-ui/icons/Restaurant'
import SpaIcon from '@material-ui/icons/Spa'
import React from 'react'
import { useMapContext } from '../context'
import { POICategory } from 'src/core/api'
import { colors } from 'src/styles'
import { BaseMarker } from './BaseMarker'

function getSize(zoom: number): { iconSize: number; size: number; } {
  return zoom < 15
    ? { size: 15, iconSize: 10 }
    : { size: 32, iconSize: 16 }
}

const icons = {
  1: RestaurantIcon,
  2: HomeIcon,
  3: AddBoxIcon,
  4: LocalDrinkIcon,
  5: ExploreIcon,
  6: SpaIcon,
  7: PeopleIcon,
}

interface Props {
  category: POICategory;
}

export function POIMarker(props: Props) {
  const { category } = props
  const { zoom } = useMapContext().value
  const { size, iconSize } = getSize(zoom)
  const color = colors.pois[category.id]
  const Icon = icons[category.id]

  return (
    <BaseMarker size={size}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: size,
          width: size,
          borderRadius: '50%',
          backgroundColor: color,
          border: 'solid 1px #fff',
          cursor: 'pointer',
        }}
      >
        <Icon style={{ color: '#fff', fontSize: iconSize }} />
      </div>
    </BaseMarker>
  )
}
