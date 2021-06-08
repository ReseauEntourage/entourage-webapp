import { FirebaseAction } from './firebase.actions'

export interface FirebaseState {
}
export const defaultFirebaseState: FirebaseState = {
}

export function firebaseReducer(
  state: FirebaseState = defaultFirebaseState,
  action: FirebaseAction,
): FirebaseState {
  switch (action.type) {
    default:
      return state
  }
}
