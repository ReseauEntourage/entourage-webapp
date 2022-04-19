import { isSSR } from './isSSR'
import 'smartbanner.js/dist/smartbanner.min.css'

export function initAppStoreBanner() {
  if (!isSSR) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/extensions
    require('smartbanner.js/dist/smartbanner.min.js')
  }
}

