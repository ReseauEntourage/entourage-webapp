import { call, getContext, put, select } from 'redux-saga/effects'
import { AuthUserActionType } from '../authUser/authUser.actions'
import { feedActions, selectCurrentFeedItemUuid } from '../feed'
import { poisActions, selectCurrentPOIUuid } from '../pois'
import { selectUser } from 'src/core/useCases/authUser'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { LocationActionType, actions, LocationActions } from './location.actions'
import { LocationErrorGeolocationRefused } from './location.errors'
import { Cities, entourageCities, IGeolocationService, selectLocation } from '.'

export interface Dependencies {
  geolocationService: IGeolocationService;
}

function* initLocationSaga() {
  const user = yield select(selectUser)
  const actionsId = yield select(selectCurrentFeedItemUuid)
  const poiId = yield select(selectCurrentPOIUuid)

  const queryId = actionsId ?? poiId ?? null

  if (!queryId) {
    if (user && user.address) {
      yield put(actions.setLocation({
        location: {
          center: {
            lat: user.address.latitude,
            lng: user.address.longitude,
          },
          displayAddress: user.address.displayAddress,
        },
      }))
    } else {
      yield put(actions.getGeolocation())
    }
  } else {
    const defaultCity = entourageCities[queryId as Cities]
    if (defaultCity) {
      yield put(actions.setLocation({
        location: {
          ...defaultCity,
        },
      }))
      yield put(feedActions.removeCurrentItemUuid())
      yield put(poisActions.removeCurrentPOIUuid())
    }
  }
}

function* getGeolocationSaga() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { getGeolocation, getPlaceAddressFromCoordinates } = dependencies.geolocationService

  try {
    const response: CallReturnType<typeof getGeolocation> = yield call(getGeolocation)

    const placeAddress: CallReturnType<typeof getPlaceAddressFromCoordinates> = yield call(
      getPlaceAddressFromCoordinates,
      response.coordinates,
    )

    if (placeAddress.placeAddress) {
      yield put(actions.setLocation({
        location: {
          center: response.coordinates,
          displayAddress: placeAddress.placeAddress,
        },
      }))
    }
  } catch (error) {
    if (error instanceof LocationErrorGeolocationRefused) {
      // Call action with the same position so that the initialized saga can get its data from gateway
      const location = yield select(selectLocation)

      yield put(actions.setLocation({
        location: {
          ...location,
        },
      }))
    }
  }
}

function* setLocation(action: LocationActions['setLocation']) {
  if (action.payload.getDisplayAddressFromCoordinates) {
    const dependencies: Dependencies = yield getContext('dependencies')
    const { getPlaceAddressFromCoordinates } = dependencies.geolocationService
    const { center } = action.payload.location
    const placeAddress: CallReturnType<typeof getPlaceAddressFromCoordinates> = yield call(
      getPlaceAddressFromCoordinates,
      center as google.maps.LatLngLiteral,
    )

    if (placeAddress.placeAddress) {
      yield put(actions.setDisplayAddress({
        displayAddress: placeAddress.placeAddress,
      }))
    }
  }
}

export function* locationSaga() {
  yield takeEvery(LocationActionType.INIT_LOCATION, initLocationSaga)
  yield takeEvery(LocationActionType.SET_LOCATION, setLocation)
  yield takeEvery(LocationActionType.GET_GEOLOCATION, getGeolocationSaga)
  yield takeEvery(AuthUserActionType.LOGIN_WITH_PASSWORD_SUCCEEDED, initLocationSaga)
  yield takeEvery(AuthUserActionType.CREATE_PASSWORD_SUCCEEDED, initLocationSaga)
  yield takeEvery(AuthUserActionType.SET_USER, initLocationSaga)
}
