import { LocaleState } from './locale.reducer'

interface AppState {
  locale: LocaleState;
}

export function selectLocale(state: AppState) {
  return state.locale.locale
}
