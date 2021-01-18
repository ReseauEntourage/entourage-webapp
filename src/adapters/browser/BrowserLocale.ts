// import { NextPageContext } from 'next'
import { ILocaleBrowser } from '../../core/useCases/locale'

export class BrowserLocale implements ILocaleBrowser {
  getBrowserLocale(): string {
    const isClientSide = typeof window === 'object'
    let browserLocale = null
    if (isClientSide) {
      browserLocale = Array.isArray(navigator.languages) ? navigator.languages[0] : navigator.languages
    }

    return browserLocale ?? 'fr-FR'
  }
}
