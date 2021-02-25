import { all, ForkEffect, getContext, select } from 'redux-saga/effects'
import { AuthUserActionType } from '../authUser/authUser.actions'
import { selectUser } from 'src/core/useCases/authUser'
import { takeEvery } from 'src/core/utils/takeEvery'
import { FirebaseEvent, FirebaseEvents, FirebaseProps } from 'src/utils/types'

import { IFirebaseService } from './IFirebaseService'
import { FirebaseActionType } from './firebase.actions'

export interface Dependencies {
  firebaseService: IFirebaseService;
}

const firebaseSagas: ForkEffect<never>[] = FirebaseEvents.map((firebaseEvent) => {
  function* saga(payload?: FirebaseProps) {
    const dependencies: Dependencies = yield getContext('dependencies')
    const { sendEvent } = dependencies.firebaseService
    yield sendEvent(firebaseEvent, payload)
  }

  return takeEvery(FirebaseActionType[firebaseEvent as FirebaseEvent], saga)
})

function* setUserId() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { setUser } = dependencies.firebaseService
  const user: ReturnType<typeof selectUser> = yield select(selectUser)
  setUser(user?.id.toString())
}

export function* firebaseSaga() {
  yield takeEvery(AuthUserActionType.LOGIN_WITH_SMS_CODE_SUCCEEDED, setUserId)
  yield takeEvery(AuthUserActionType.LOGIN_WITH_PASSWORD_SUCCEEDED, setUserId)
  yield takeEvery(AuthUserActionType.SET_USER, setUserId)
  yield all(firebaseSagas)
}
