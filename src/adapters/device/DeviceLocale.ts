// import { NextPageContext } from 'next'
import { IDeviceLocale } from '../../core/useCases/locale'
import { Locale } from '../../core/useCases/locale/locale.reducer'

import { isSSR } from '../../utils/misc'

export class DeviceLocale implements IDeviceLocale {
  getDeviceLocale(): Locale {
    let browserLocale = null
    if (!isSSR) {
      browserLocale = Array.isArray(navigator.languages) ? navigator.languages[0] : navigator.languages
    }

    return browserLocale ? browserLocale.substr(0, 2) : 'fr'
  }
}
