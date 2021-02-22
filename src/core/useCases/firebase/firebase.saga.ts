import { call, getContext, put, select } from 'redux-saga/effects'
import { snakeToCamel } from '../../../utils/misc/strings'
import { sendEvent, setUser } from '../../services/firebase'
import { AuthUserActionType } from '../authUser/authUser.actions'
import { feedActions, selectCurrentFeedItemUuid } from '../feed'
import { poisActions, selectCurrentPOIUuid } from '../pois'
import { selectUser } from 'src/core/useCases/authUser'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { LocationActionType, actions, LocationActions } from './location.actions'
import { LocationErrorGeolocationRefused } from './location.errors'
import { Cities, entourageCities, IGeolocationService, selectLocation } from '.'

export const firebaseEvents: string[] = [
  'LOGIN',
]

const events = firebaseEvents.reduce((acc, curr) => {
  return {
    ...acc,
    * [snakeToCamel(curr)]() { yield sendEvent(curr) },
  }
}, {})

export interface Dependencies {
  geolocationService: IGeolocationService;
}

function* setUserId() {
  const user = yield select(selectUser)
  setUser(user?.id)
}

export function* firebaseSaga() {
  yield takeEvery(AuthUserActionType.LOGIN_WITH_SMS_CODE_SUCCEEDED, setUserId)
  yield takeEvery(AuthUserActionType.SET_USER, setUserId)

  yield takeEvery(AuthUserActionType.SET_USER, events.login)
}
