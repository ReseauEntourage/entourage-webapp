import { Action, ActionType } from './locale.actions'

export interface LocaleState {
  locale: string;
}

export const defaultLocaleState: LocaleState = {
  locale: 'fr-FR',
}

export function localeReducer(state: LocaleState = defaultLocaleState, action: Action): LocaleState {
  switch (action.type) {
    case ActionType.SET_LOCALE_SUCCEEDED: {
      return {
        ...state,
        locale: action.payload.locale,
      }
    }

    default:
      return state
  }
}
