export interface IAuthUserSensitizationStorage {
  getHasSeenPopup(userId: number): boolean;
  setHasSeenPopup(userId: number): void;
}
