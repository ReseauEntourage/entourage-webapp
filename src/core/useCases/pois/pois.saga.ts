import { call, put, select, getContext, take, cancel } from 'redux-saga/effects'
import { Cities, entourageCities, locationActions, selectLocation } from '../location'
import { LocationActionType } from '../location/location.actions'
import { constants } from 'src/constants'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { IPOIsGateway } from './IPOIsGateway'
import { POIsActionType, actions, POIsActions } from './pois.actions'
import { selectCurrentPOI, selectPOIs, selectPOIsIsIdle } from './pois.selectors'

export const calculateDistanceFromZoom = (zoom: number) => {
  if (zoom <= constants.DEFAULT_LOCATION.ZOOM) {
    return constants.POI_MAX_DISTANCE
  } if (zoom >= constants.POI_DISTANCE_BREAKPOINT) {
    return constants.POI_MIN_DISTANCE
  }
  return (constants.POI_MAX_DISTANCE - constants.POI_MIN_DISTANCE) / 2
}

export interface Dependencies {
  poisGateway: IPOIsGateway;
}

function* retrieveLocalizedPOIs() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrievePOIs } = dependencies.poisGateway
  const poisState: ReturnType<typeof selectPOIs> = yield select(selectPOIs)
  const positionState: ReturnType<typeof selectLocation> = yield select(selectLocation)

  const { fetching } = poisState
  const { zoom, center } = positionState

  if (fetching) {
    return
  }

  yield put(actions.retrievePOIsStarted())

  const response: CallReturnType<typeof retrievePOIs> = yield call(
    retrievePOIs,
    { filters: { center, zoom: calculateDistanceFromZoom(zoom) },
    },
  )
  yield put(actions.retrievePOIsSuccess(response))
}

function* setCurrentPOIUuid(action: POIsActions['setCurrentPOIUuid']) {
  const currentPOI: ReturnType<typeof selectCurrentPOI> = yield select(selectCurrentPOI)
  const poisIsIdle: ReturnType<typeof selectPOIsIsIdle> = yield select(selectPOIsIsIdle)
  const poiUuid = action.payload

  if (!currentPOI && poiUuid) {
    const isCityId = entourageCities[poiUuid as Cities]

    if (isCityId) {
      yield put(locationActions.initLocation())
      yield put(actions.retrievePOIDetailsEnded())
    } else {
      const dependencies: Dependencies = yield getContext('dependencies')
      const { retrievePOI } = dependencies.poisGateway

      const response: CallReturnType<typeof retrievePOI> = yield call(retrievePOI, { poiUuid })

      yield put(actions.retrievePOIDetailsSuccess(response))

      if (poisIsIdle) {
        yield put(locationActions.setLocation({
          location: {
            center: {
              lat: response.poiDetails.latitude,
              lng: response.poiDetails.longitude,
            },
          },
        }))
      }
    }
  } else {
    if (!poiUuid && poisIsIdle) {
      yield put(locationActions.initLocation())
    }
    yield put(actions.retrievePOIDetailsEnded())
  }
}

export function* poisSaga() {
  yield takeEvery(POIsActionType.RETRIEVE_POIS, retrieveLocalizedPOIs)
  yield takeEvery(POIsActionType.SET_CURRENT_POI_UUID, setCurrentPOIUuid)
  while (yield take(POIsActionType.INIT_POIS)) {
    const bgRetrievePOIs = yield takeEvery(LocationActionType.SET_LOCATION, retrieveLocalizedPOIs)
    yield take(POIsActionType.CANCEL_POIS)
    yield cancel(bgRetrievePOIs)
  }
}
