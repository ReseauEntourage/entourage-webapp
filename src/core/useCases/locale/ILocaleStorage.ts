export interface ILocaleStorage {
  getSavedLocale(): string | null;
  storeLocale(locale: string): void | null;
}
