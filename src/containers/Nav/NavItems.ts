import { plateform } from 'src/utils/misc'
import { NavItemsDeskTop } from './NavItemsDesktop'
import { NavItemsMobile } from './NavItemsMobile'

export const NavItems = plateform({
  Desktop: NavItemsDeskTop,
  Mobile: NavItemsMobile,
})
