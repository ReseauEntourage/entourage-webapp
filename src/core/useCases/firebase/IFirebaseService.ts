import { FirebaseProps } from 'src/utils/types'

export interface IFirebaseService {
  sendEvent(event: string, props?: FirebaseProps): void;

  setUser(userId?: string): void;
}
