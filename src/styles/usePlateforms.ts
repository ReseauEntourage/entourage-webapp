import { useWindowWidth } from '@react-hook/window-size'
import MobileDetect from 'mobile-detect'
import { useSSRDataContext } from 'src/core/SSRDataContext'
import { isSSR } from 'src/utils/misc'
import { breakpoints } from './breakpoints'

export function useIsDesktop() {
  const { userAgent } = useSSRDataContext()
  const mobileDetect = new MobileDetect(userAgent)
  const userAgentIsDesktop = !mobileDetect.mobile() && !mobileDetect.tablet()

  const windowWidth = useWindowWidth()

  if (isSSR) {
    return userAgentIsDesktop
  }

  return windowWidth >= breakpoints.mobile
}

export function useIsMobile() {
  return !useIsDesktop()
}
