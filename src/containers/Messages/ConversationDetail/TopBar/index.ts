import { plateform } from 'src/utils/misc'
import { TopBarDesktop } from './TopBar.desktop'
import { TopBarMobile } from './TopBar.mobile'

export interface TopBarProps {
  title: string;
}

export const TopBar = plateform({
  Desktop: TopBarDesktop,
  Mobile: TopBarMobile,
})
