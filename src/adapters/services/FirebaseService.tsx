import firebase from 'firebase/app'
import { IFirebaseService } from 'src/core/useCases/firebase'
import { isSSR } from 'src/utils/misc'
import { FirebaseEvent, FirebaseProps } from 'src/utils/types'

/*
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  databaseURL: env.FIREBASE_DATABASE_URL,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
}
*/

export class FirebaseService implements IFirebaseService {
  private static getAnalytics() {
    if (firebase) {
    /*
      if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig)
      }
    */
      return firebase.analytics()
    }
    return null
  }

  sendEvent(event: FirebaseEvent, props?: FirebaseProps) {
    if (isSSR) return

    const firebaseAnalytics = FirebaseService.getAnalytics()
    if (firebaseAnalytics) {
      firebaseAnalytics.logEvent(event, props)
    }
  }

  setUser(userId?: string) {
    if (isSSR) return
    const firebaseAnalytics = FirebaseService.getAnalytics()
    if (firebaseAnalytics) {
      firebaseAnalytics.setUserId(userId ?? '')
    }
  }
}
