import { call, put, select, getContext, take, cancel } from 'redux-saga/effects'
import { CallReturnType } from '../../utils/CallReturnType'
import { positionActions, selectPosition } from '../position'
import { PositionActionType } from '../position/position.actions'
import { takeEvery } from 'src/core/utils/takeEvery'
import { IPOIsGateway } from './IPOIsGateway'
import { POIsActionType, actions, POIsActions } from './pois.actions'
import { POIsState } from './pois.reducer'
import { selectCurrentPOI, selectPOIs, selectPOIsIsIdle } from './pois.selectors'


export interface Dependencies {
  poisGateway: IPOIsGateway;
}

function* retrieveLocalizedPOIs() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrievePOIs } = dependencies.poisGateway
  const poisState: ReturnType<typeof selectPOIs> = yield select(selectPOIs)
  const positionState: ReturnType<typeof selectPosition> = yield select(selectPosition)

  const { fetching } = poisState
  const { zoom, center } = positionState

  if (fetching) {
    return
  }

  yield put(actions.retrievePOIsStarted())

  const response: CallReturnType<typeof retrievePOIs> = yield call(
    retrievePOIs,
    { filters: { center, zoom },
    },
  )
  yield put(actions.retrievePOIsSuccess(response))
}

function* setCurrentPOIUuid(action: POIsActions['setCurrentPOIUuid']) {
  const currentPOI: ReturnType<typeof selectCurrentPOI> = yield select(selectCurrentPOI)
  const isIdle: ReturnType<typeof selectPOIsIsIdle> = yield select(selectPOIsIsIdle)

  const poiUuid = action.payload

  if (!currentPOI && poiUuid) {
    const dependencies: Dependencies = yield getContext('dependencies')
    const { retrievePOI } = dependencies.poisGateway
    const response: CallReturnType<typeof retrievePOI> = yield call(retrievePOI, { poiUuid })
    yield put(actions.retrievePOIDetailsSuccess(response))
    if (isIdle) {
      yield put(positionActions.setPosition({
        center: {
          lat: response.poiDetails.latitude,
          lng: response.poiDetails.longitude,
        },
      }))
    }
  } else {
    yield put(actions.retrievePOIDetailsEnded())
  }
}

export function* poisSaga() {
  yield takeEvery(POIsActionType.RETRIEVE_POIS, retrieveLocalizedPOIs)
  yield takeEvery(POIsActionType.SET_CURRENT_POI_UUID, setCurrentPOIUuid)
  while (yield take(POIsActionType.INIT_POIS)) {
    const bgRetrievePOIs = yield takeEvery(PositionActionType.SET_POSITION, retrieveLocalizedPOIs)
    yield take(POIsActionType.CANCEL_POIS)
    yield cancel(bgRetrievePOIs)
  }
}
