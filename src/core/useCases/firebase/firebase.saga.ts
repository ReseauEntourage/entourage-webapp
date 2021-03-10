import { getContext, select } from 'redux-saga/effects'
import { AuthUserActionType } from '../authUser/authUser.actions'
import { selectUser } from 'src/core/useCases/authUser'
import { takeEvery } from 'src/core/utils/takeEvery'

import { IFirebaseService } from './IFirebaseService'
import { FirebaseActions, FirebaseActionType } from './firebase.actions'

export interface Dependencies {
  firebaseService: IFirebaseService;
}

function* sendFirebaseEvent(action: FirebaseActions['sendFirebaseEvent']) {
  const { event, props } = action.payload
  const dependencies: Dependencies = yield getContext('dependencies')
  const { sendEvent } = dependencies.firebaseService
  sendEvent(event, props)
}

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

  yield takeEvery(FirebaseActionType.SEND_EVENT, sendFirebaseEvent)
}
