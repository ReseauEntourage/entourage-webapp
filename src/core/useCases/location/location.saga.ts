import { call, getContext, put, select } from 'redux-saga/effects'
import { AuthUserActionType } from '../authUser/authUser.actions'
import { feedActions, selectCurrentFeedItemUuid } from '../feed'
import { poisActions, selectCurrentPOIUuid } from '../pois'
import { selectUser } from 'src/core/useCases/authUser'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { Cities, EntourageCities } from 'src/utils/types'
import { LocationActionType, actions, LocationActions, LocationAction } from './location.actions'
import { LocationErrorGeolocationRefused } from './location.errors'
import { IGeolocationService, selectLocation } from '.'

export interface Dependencies {
  geolocationService: IGeolocationService;
}

function* initLocationSaga() {
  const user = yield select(selectUser)

  if (user?.address) {
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
      yield put(actions.geolocationRefused())
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
