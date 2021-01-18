import { useSelector } from 'react-redux'
import { selectLocale } from '../core/useCases/locale'
import { Locale } from '../core/useCases/locale/locale.reducer'
import { Texts, texts as frTexts } from './fr'

const langs: Record<Locale, Texts> = {
  fr: frTexts,
  en: frTexts,
}

export const allowedLocales = Object.keys(langs)
export const defaultLocale = 'fr'

export function useI18n() {
  const locale = useSelector(selectLocale)

  if (langs[locale]) {
    return langs[locale]
  }
  return langs.fr
}
