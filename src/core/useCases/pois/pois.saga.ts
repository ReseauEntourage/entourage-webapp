import { call, put, select, getContext, take, cancel } from 'redux-saga/effects'
import { CommonActionType } from '../common'
import { Cities, entourageCities, locationActions, selectLocation, selectLocationIsInit } from '../location'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { formatPOIsCategories, formatPOIsPartners } from 'src/utils/misc'
import { IPOIsGateway } from './IPOIsGateway'
import { POIsActionType, actions, POIsActions } from './pois.actions'
import { selectCurrentPOI, selectPOIs, selectPOIsIsIdle } from './pois.selectors'

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

  const response: CallReturnType<typeof poisGateway.retrievePOIs> = yield call(
    poisGateway.retrievePOIs,
    {
      filters: {
        location: {
          center,
          distance: 1,
        },
        categories,
        partners,
      },
    },
  )
  yield put(actions.retrievePOIsSuccess(response))
  yield put(locationActions.setMapHasMoved(false))
}

function* setCurrentPOIUuid(action: POIsActions['setCurrentPOIUuid']) {
  const currentPOI: ReturnType<typeof selectCurrentPOI> = yield select(selectCurrentPOI)
  const poisIsIdle: ReturnType<typeof selectPOIsIsIdle> = yield select(selectPOIsIsIdle)
  const locationIsInit: ReturnType<typeof selectLocationIsInit> = yield select(selectLocationIsInit)
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
            displayAddress: response.poiDetails.address,
          },
        }))
        yield put(actions.retrievePOIs())
      }
    }
  } else {
    if (!poiUuid) {
      if (locationIsInit) {
        yield put(actions.retrievePOIs())
      } else {
        yield put(locationActions.initLocation())
      }
    }
    yield put(actions.retrievePOIDetailsEnded())
  }
}

export function* poisSaga() {
  yield takeEvery(POIsActionType.RETRIEVE_POIS, retrievePOIs)
  yield takeEvery(POIsActionType.TOGGLE_POIS_FILTER, retrievePOIs)
  yield takeEvery(POIsActionType.RESET_POIS_FILTERS, retrievePOIs)

  yield takeEvery(POIsActionType.SET_CURRENT_POI_UUID, setCurrentPOIUuid)
  while (yield take(POIsActionType.INIT_POIS)) {
    const bgRetrievePOIs = yield takeEvery(CommonActionType.FETCH_DATA, retrievePOIs)
    yield take(POIsActionType.CANCEL_POIS)
    yield cancel(bgRetrievePOIs)
  }
}
