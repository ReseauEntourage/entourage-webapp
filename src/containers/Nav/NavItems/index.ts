import { plateform } from 'src/utils/misc'
import { NavItemsDeskTop } from './NavItems.desktop'
import { NavItemsMobile } from './NavItems.mobile'

export const NavItems = plateform({
  Desktop: NavItemsDeskTop,
  Mobile: NavItemsMobile,
})
