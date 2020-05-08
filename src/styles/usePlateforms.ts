import { useWindowWidth } from '@react-hook/window-size'
import { breakpoints } from './breakpoints'

export function useIsDesktop() {
  const windowWidth = useWindowWidth()
  return windowWidth >= breakpoints.mobile
}

export function useIsMobile() {
  return !useIsDesktop()
}
