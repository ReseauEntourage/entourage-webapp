export interface IAuthUserTokenStorage {
  getToken(): string | null;
  setToken(token: string): void;
}
