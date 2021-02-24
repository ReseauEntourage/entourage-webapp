import { call, put, select, getContext, take, cancel } from 'redux-saga/effects'
import { locationActions, selectLocation, selectLocationIsInit } from '../location'
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

function* retrievePOIs() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { poisGateway } = dependencies
  const poisState: ReturnType<typeof selectPOIs> = yield select(selectPOIs)
  const positionState: ReturnType<typeof selectLocation> = yield select(selectLocation)

  const { fetching } = poisState
  const { zoom, center } = positionState

  if (fetching) {
    return
  }

  yield put(actions.retrievePOIsStarted())

  const response: CallReturnType<typeof poisGateway.retrievePOIs> = yield call(
    poisGateway.retrievePOIs,
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
    const dependencies: Dependencies = yield getContext('dependencies')
    const { retrievePOI } = dependencies.poisGateway

    const response: CallReturnType<typeof retrievePOI> = yield call(retrievePOI, { poiUuid })

    yield put(actions.retrievePOIDetailsSuccess(response))

    // Used to check if the POIs list has already been retrieved. If no, it means we arrived directly using the poiId
    if (poisIsIdle) {
      yield put(locationActions.setLocation({
        location: {
          center: {
            lat: response.poiDetails.latitude,
            lng: response.poiDetails.longitude,
          },
          displayAddress: response.poiDetails.address,
        },
      }))
    }
  }
  yield put(actions.retrievePOIDetailsEnded())
}

function* retrievePOIsOrInitLocation() {
  const locationIsInit: ReturnType<typeof selectLocationIsInit> = yield select(selectLocationIsInit)
  if (locationIsInit) {
    yield put(actions.retrievePOIs())
  } else {
    yield put(locationActions.initLocation())
  }
}

export function* poisSaga() {
  yield takeEvery(POIsActionType.RETRIEVE_POIS, retrievePOIs)
  yield takeEvery(POIsActionType.SET_CURRENT_POI_UUID, setCurrentPOIUuid)
  yield takeEvery(POIsActionType.RETRIEVE_POIS_OR_INIT_LOCATION, retrievePOIsOrInitLocation)

  while (yield take(POIsActionType.INIT_POIS)) {
    const setLocationRetrievePOIs = yield takeEvery(LocationActionType.SET_LOCATION, retrievePOIs)
    const geolocationRefusedRetrievePOIs = yield takeEvery(LocationActionType.GEOLOCATION_REFUSED, retrievePOIs)
    yield take(POIsActionType.CANCEL_POIS)
    yield cancel(setLocationRetrievePOIs)
    yield cancel(geolocationRefusedRetrievePOIs)
  }
}
