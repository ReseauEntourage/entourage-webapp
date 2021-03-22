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
  SvgIconComponent, Wc,
} from '@material-ui/icons'
import { POICategory } from 'src/core/api'

export const poiIcons: Record<POICategory['id'], SvgIconComponent> = {
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

export const poiLabels: Record<POICategory['id'], POICategory['name']> = {
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
