import { Tooltip } from '@material-ui/core'
import {
  Bathtub,
  CardGiftcard,
  Explore,
  Home,
  LocalDrink,
  LocalHospital,
  LocalLaundryService,
  LocalMall,
  Lock,
  MoreHoriz,
  People,
  Restaurant,
  Spa,
  Stars,
  SvgIconComponent,
  Wc,
} from '@material-ui/icons'
import React from 'react'
import { POICategory } from 'src/core/api'
import { colors } from 'src/styles'
import { roundToEven } from 'src/utils/misc'

const poiIcons: Record<POICategory['id'], SvgIconComponent> = {
  0: MoreHoriz,
  1: Restaurant,
  2: Home,
  3: LocalHospital,
  5: Explore,
  7: People,
  8: Stars,
  40: Wc,
  41: LocalDrink,
  42: Bathtub,
  43: LocalLaundryService,
  6: Spa,
  61: LocalMall,
  63: Lock,
  62: CardGiftcard,
}

const poiLabels: Record<POICategory['id'], POICategory['name']> = {
  0: 'Autre',
  1: 'Se nourrir',
  2: 'Se loger',
  3: 'Se soigner',
  5: 'S\'orienter',
  7: 'Se réinsérer',
  8: 'Partenaires',
  40: 'Toilettes',
  41: 'Fontaines',
  42: 'Douches',
  43: 'Laveries',
  6: 'Bien-être & activités',
  61: 'Vêtements & matériels',
  63: 'Bagageries',
  62: 'Boîtes à dons & lire',
}

interface POIIconProps {
  poiCategory: POICategory['id'];
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
          border: 'solid 1px #fff',
          cursor: 'pointer',
          zIndex: isActive ? 2 : 1,
        }}
      >
        <Icon
          style={{
            color: '#fff', fontSize,
          }}
        />
      </div>
    </Tooltip>
  )
}
