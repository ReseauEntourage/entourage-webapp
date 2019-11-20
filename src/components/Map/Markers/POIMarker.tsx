import React from 'react'
import RestaurantIcon from '@material-ui/icons/Restaurant'
import AddBoxIcon from '@material-ui/icons/AddBox'
import HomeIcon from '@material-ui/icons/Home'
import PeopleIcon from '@material-ui/icons/People'
import ExploreIcon from '@material-ui/icons/Explore'
import LocalDrinkIcon from '@material-ui/icons/LocalDrink'
import SpaIcon from '@material-ui/icons/Spa'
import { styles } from 'src/styles'
import { POICategory } from 'src/api'
import { BaseMarker } from './BaseMarker'
import { MarkerProps } from './types'
import { useMapContext } from '../context'

function getSize(zoom: number): { size: number; iconSize: number; } {
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

interface Props extends MarkerProps {
  category: POICategory;
}

// disable ESLint because lat and lng are internaly use by Google Map
// eslint-disable-next-line
export function POIMarker(props: Props) {
  const { category } = props
  const { zoom } = useMapContext().value
  const { size, iconSize } = getSize(zoom)
  const color = styles.pois[category.id]
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
