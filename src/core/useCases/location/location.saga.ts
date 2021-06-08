import { call, getContext, put, select } from 'redux-saga/effects'
import { AuthUserActionType } from '../authUser/authUser.actions'
import { feedActions } from '../feed'
import { FeedActions, FeedActionType } from '../feed/feed.actions'
import { poisActions } from '../pois'
import { POIsActions, POIsActionType } from '../pois/pois.actions'
import { constants } from 'src/constants'
import { selectUser } from 'src/core/useCases/authUser'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { Cities, EntourageCities } from 'src/utils/types'
import { LocationActionType, actions, LocationActions } from './location.actions'
import { LocationErrorGeolocationRefused } from './location.errors'
import { IGeolocationService, locationActions, selectLocationIsInit } from '.'

export interface Dependencies {
  geolocationService: IGeolocationService;
}

function* checkIfCitySaga(action: FeedActions['setCurrentFeedItemUuid'] | POIsActions['setCurrentPOIUuid']) {
  const actionOrPOIId = action.payload
  const locationIsInit: ReturnType<typeof selectLocationIsInit> = yield select(selectLocationIsInit)

  if (actionOrPOIId) {
    const defaultCity = EntourageCities[actionOrPOIId as Cities]
    if (defaultCity) {
      yield put(actions.setMapPosition({
        center: defaultCity.center,
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      }))
      yield put(actions.setLocation({
        location: {
          ...defaultCity,
          zoom: constants.DEFAULT_LOCATION.ZOOM,
        },
      }))
      yield put(feedActions.removeCurrentFeedItemUuid())
      yield put(poisActions.removeCurrentPOIUuid())
    } else {
      yield put(actions.retrieveSelectedItemDetails())
    }
  } else if (locationIsInit) {
    yield put(actions.retrieveRelevantData())
  } else {
    yield put(locationActions.initLocation())
  }
}

function* initLocationSaga() {
  const user: ReturnType<typeof selectUser> = yield select(selectUser)

  if (user && user.address) {
    yield put(actions.setMapPosition({
      center: {
        lat: user.address.latitude,
        lng: user.address.longitude,
      },
      zoom: constants.DEFAULT_LOCATION.ZOOM,
    }))
    yield put(actions.setLocation({
      location: {
        center: {
          lat: user.address.latitude,
          lng: user.address.longitude,
        },
        displayAddress: user.address.displayAddress,
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      },
    }))
  } else {
    yield put(actions.getGeolocation({
      updateLocationFilter: true,
    }))
  }
}

function* getGeolocationSaga(action: LocationActions['getGeolocation']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { getGeolocation, getPlaceAddressFromCoordinates } = dependencies.geolocationService

  try {
    const response: CallReturnType<typeof getGeolocation> = yield call(getGeolocation)

    const placeAddress: CallReturnType<typeof getPlaceAddressFromCoordinates> = yield call(
      getPlaceAddressFromCoordinates,
      response.coordinates,
      true,
    )

    if (placeAddress.placeAddress) {
      if (action.payload.updateLocationFilter) {
        yield put(actions.setMapPosition({
          center: response.coordinates,
          zoom: constants.DEFAULT_LOCATION.ZOOM,
        }))
        yield put(actions.setLocation({
          location: {
            center: response.coordinates,
            displayAddress: placeAddress.placeAddress,
            zoom: constants.DEFAULT_LOCATION.ZOOM,
          },
        }))
      }
      yield put(actions.setGeolocation({
        geolocation: {
          ...response.coordinates,
          displayAddress: placeAddress.placeAddress,
          googlePlaceId: placeAddress.googlePlaceId,
        },
      }))
    }
  } catch (error) {
    if (error instanceof LocationErrorGeolocationRefused) {
      yield put(actions.setLocationIsInitialized())
      yield put(actions.retrieveRelevantData())
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
  yield takeEvery(FeedActionType.SET_CURRENT_ITEM_UUID, checkIfCitySaga)
  yield takeEvery(POIsActionType.SET_CURRENT_POI_UUID, checkIfCitySaga)

  yield takeEvery(LocationActionType.INIT_LOCATION, initLocationSaga)
  yield takeEvery(LocationActionType.SET_LOCATION, setLocation)
  yield takeEvery(LocationActionType.GET_GEOLOCATION, getGeolocationSaga)
  yield takeEvery(AuthUserActionType.LOGIN_WITH_PASSWORD_SUCCEEDED, initLocationSaga)
  yield takeEvery(AuthUserActionType.CREATE_PASSWORD_SUCCEEDED, initLocationSaga)
}
