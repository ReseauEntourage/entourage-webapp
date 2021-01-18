import { Locale } from './locale.reducer'

export interface ILocaleStorage {
  getSavedLocale(): Locale | null;
  storeLocale(locale: Locale): void | null;
}
