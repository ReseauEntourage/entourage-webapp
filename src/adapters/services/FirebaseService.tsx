import firebase from 'firebase/app'
import { env } from 'src/core/env'
import { IFirebaseService } from 'src/core/useCases/firebase'
import { isSSR } from 'src/utils/misc'
import { FirebaseEvent, FirebaseProps } from 'src/utils/types'
import 'firebase/analytics'

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

export class FirebaseService implements IFirebaseService {
  private static getAnalytics() {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig)
    }

    return firebase.analytics()
  }

  sendEvent(event: FirebaseEvent, props?: FirebaseProps) {
    if (isSSR) return

    FirebaseService.getAnalytics().logEvent(event, props)
  }

  setUser(userId?: string) {
    if (isSSR) return

    FirebaseService.getAnalytics().setUserId(userId ?? '')
  }
}
