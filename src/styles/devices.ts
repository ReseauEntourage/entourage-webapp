import { breakpoints } from './breakpoints'

export const devices = {
  mobile: `(max-width: ${breakpoints.mobile - 1}px)`,
  desktop: `(min-width: ${breakpoints.mobile}px)`,
}
