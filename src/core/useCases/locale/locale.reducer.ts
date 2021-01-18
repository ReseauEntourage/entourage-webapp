import { Action, ActionType } from './locale.actions'

export type Locale = 'fr' | 'en'

export interface LocaleState {
  locale: Locale;
}

export const defaultLocaleState: LocaleState = {
  locale: 'fr',
}

export function localeReducer(state: LocaleState = defaultLocaleState, action: Action): LocaleState {
  switch (action.type) {
    case ActionType.SET_LOCALE: {
      return {
        ...state,
        locale: action.payload.locale,
      }
    }

    default:
      return state
  }
}
