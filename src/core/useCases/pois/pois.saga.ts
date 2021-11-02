import { call, put, select, getContext, take, cancel } from 'redux-saga/effects'
import { locationActions, selectLocation } from '../location'
import { LocationActionType } from '../location/location.actions'
import { notificationsActions } from '../notifications'
import { constants } from 'src/constants'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { formatPOIsCategories, formatPOIsPartners } from 'src/utils/misc'
import { IPOIsGateway } from './IPOIsGateway'
import { POIsActionType, actions } from './pois.actions'
import { selectCurrentPOI, selectCurrentPOIUuid, selectPOIs, selectPOIsIsIdle } from './pois.selectors'

export interface Dependencies {
  poisGateway: IPOIsGateway;
}

function* retrievePOIs() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { poisGateway } = dependencies
  const poisState: ReturnType<typeof selectPOIs> = yield select(selectPOIs)
  const positionState: ReturnType<typeof selectLocation> = yield select(selectLocation)

  const { fetching, filters: categoryFilters } = poisState
  const { center } = positionState

  if (fetching) {
    return
  }

  yield put(actions.retrievePOIsStarted())

  const categories = categoryFilters.categories.length > 0
    ? formatPOIsCategories(categoryFilters.categories) : undefined
  const partners = categoryFilters.partners.length > 0
    ? formatPOIsPartners(categoryFilters.partners) : undefined

  try {
    const response: CallReturnType<typeof poisGateway.retrievePOIs> = yield call(
      poisGateway.retrievePOIs,
      {
        filters: {
          location: {
            center,
            distance: constants.POI_DISTANCE,
          },
          categories,
          partners,
        },
      },
    )
    yield put(actions.retrievePOIsSuccess(response))
  } catch (err) {
    yield put(actions.retrievePOIsFail())
    yield put(notificationsActions.addAlert({
      message: err?.message,
      severity: 'error',
    }))
  }
}

function* retrieveCurrentPOI() {
  const currentPOI: ReturnType<typeof selectCurrentPOI> = yield select(selectCurrentPOI)
  const poisIsIdle: ReturnType<typeof selectPOIsIsIdle> = yield select(selectPOIsIsIdle)
  const poiUuid: ReturnType<typeof selectCurrentPOIUuid> = yield select(selectCurrentPOIUuid)

  if (!currentPOI && poiUuid) {
    yield put(actions.retrievePOIDetailsStarted())

    const dependencies: Dependencies = yield getContext('dependencies')
    const { retrievePOI } = dependencies.poisGateway

    try {
      const response: CallReturnType<typeof retrievePOI> = yield call(retrievePOI, { poiUuid })

      yield put(actions.retrievePOIDetailsSuccess(response))

      if (poisIsIdle) {
        yield put(locationActions.setMapPosition({
          center: {
            lat: response.poiDetails.latitude,
            lng: response.poiDetails.longitude,
          },
          zoom: constants.DEFAULT_LOCATION.ZOOM,
        }))
        yield put(locationActions.setLocation({
          location: {
            center: {
              lat: response.poiDetails.latitude,
              lng: response.poiDetails.longitude,
            },
            displayAddress: response.poiDetails.address,
            zoom: constants.DEFAULT_LOCATION.ZOOM,
          },
        }))
      }
    } catch (err) {
      yield put(actions.retrievePOIDetailsFail())
      yield put(notificationsActions.addAlert({
        message: err?.message,
        severity: 'error',
      }))
    }
  }
}

export function* poisSaga() {
  yield takeEvery(POIsActionType.RETRIEVE_POIS, retrievePOIs)
  yield takeEvery(POIsActionType.TOGGLE_POIS_FILTER, retrievePOIs)
  yield takeEvery(POIsActionType.RESET_POIS_FILTERS, retrievePOIs)

  while (yield take(POIsActionType.INIT_POIS)) {
    const setLocationRetrievePOIs = yield takeEvery(LocationActionType.SET_LOCATION, retrievePOIs)
    const retrieveDataRetrievePOIs = yield takeEvery(LocationActionType.RETRIEVE_RELEVANT_DATA, retrievePOIs)
    const retrieveItemRetrievePOI = yield takeEvery(
      LocationActionType.RETRIEVE_SELECTED_ITEM_DETAILS,
      retrieveCurrentPOI,
    )
    yield take(POIsActionType.CANCEL_POIS)
    yield cancel(setLocationRetrievePOIs)
    yield cancel(retrieveDataRetrievePOIs)
    yield cancel(retrieveItemRetrievePOI)
  }
}
