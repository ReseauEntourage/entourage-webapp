import { useSelector } from 'react-redux'
import { selectLang } from '../core/useCases/locale'
import { bootstrapStore } from 'src/core/boostrapStore'
import * as fr from './fr'

const langs = {
  fr,
  en: fr,
}

export const allowedLocales = Object.keys(langs)
export const defaultLocale = 'fr'

export function useI18n() {
  const locale = useSelector(selectLang)

  if (langs[locale]) {
    return langs[locale].texts
  }
  return langs.fr.texts
}
