import firebase from 'firebase/app'
import { useCallback, useMemo } from 'react'
import { useStateGetter } from '../../utils/hooks'
import { isSSR } from '../../utils/misc'
import { env } from '../env'
import 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
}

function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

  return firebase.analytics()
}

export function sendEvent(event: string) {
  if (isSSR) return

  initFirebase().logEvent(event)
}

export function setUser(userId: string) {
  if (isSSR) return

  initFirebase().setUserId(userId)
}
