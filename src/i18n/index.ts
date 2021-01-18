import { selectLang } from '../core/useCases/locale'
import { AnyCantFix } from '../utils/types'
import { bootstrapStore } from 'src/core/boostrapStore'
import * as fr from './fr'

interface Languages {
  [key: string]: Record<string, Record<string, AnyCantFix>>;
}

const langs: Languages = {
  fr,
}

export const l18n = (): AnyCantFix => {
  const locale = selectLang(bootstrapStore().getState())
  if (langs[locale]) {
    return langs[locale].texts
  }
  return langs.fr.texts
}
