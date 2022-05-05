import { call, put, select, getContext, cancel, take } from 'redux-saga/effects'
import { locationActions, selectLocation } from '../location'
import { LocationActionType } from '../location/location.actions'
import { notificationsActions } from '../notifications'
import { constants } from 'src/constants'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { formatFeedTypes } from 'src/utils/misc'
import { AnyGeneratorOutput } from 'src/utils/types'
import { IFeedGateway } from './IFeedGateway'
import { FeedActionType, actions, FeedActions } from './feed.actions'
import {
  selectCurrentFeedItem,
  selectCurrentFeedItemUuid,
  selectEventImagesFetching,
  selectFeed,
} from './feed.selectors'

export interface Dependencies {
  feedGateway: IFeedGateway;
}

function* retrieveFeed() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveFeedItems } = dependencies.feedGateway
  const feedState: ReturnType<typeof selectFeed> = yield select(selectFeed)
  const currentItem: ReturnType<typeof selectCurrentFeedItem> = yield select(selectCurrentFeedItem)

  const positionState: ReturnType<typeof selectLocation> = yield select(selectLocation)
  const { nextPageToken, fetching, filters, isIdle } = feedState
  const { zoom, center } = positionState

  if (fetching) {
    return
  }

  yield put(actions.retrieveFeedStarted())

  const types = formatFeedTypes(filters.actionTypes, filters.events)

  try {
    const response: CallReturnType<typeof retrieveFeedItems> = yield call(
      retrieveFeedItems,
      {
        filters: { types, location: { center, zoom }, timeRange: filters.timeRange },
        nextPageToken: nextPageToken || undefined,
      },
    )

    if (isIdle && currentItem) {
      const filteredItems = response.items.filter((item) => item.uuid !== currentItem.uuid)
      yield put(actions.retrieveFeedSuccess({
        ...response,
        items: [
          currentItem,
          ...filteredItems,
        ],
      }))
    } else {
      yield put(actions.retrieveFeedSuccess(response))
    }
  } catch (err) {
    yield put(actions.retrieveFeedFail())
    yield put(notificationsActions.addAlert({
      message: err?.message,
      severity: 'error',
    }))
  }
}

function* retrieveFeedNextPage() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveFeedItems } = dependencies.feedGateway
  const feedState: ReturnType<typeof selectFeed> = yield select(selectFeed)
  const positionState: ReturnType<typeof selectLocation> = yield select(selectLocation)
  const { nextPageToken, fetching, filters } = feedState
  const { zoom, center } = positionState

  if (!nextPageToken || fetching) {
    return
  }

  try {
    yield put(actions.retrieveFeedNextPageStarted())

    const types = formatFeedTypes(filters.actionTypes, filters.events)
    const response: CallReturnType<typeof retrieveFeedItems> = yield call(
      retrieveFeedItems,
      {
        filters: { types, location: { center, zoom }, timeRange: filters.timeRange },
        nextPageToken: nextPageToken || undefined,
      },
    )
    yield put(actions.retrieveFeedNextPageSuccess(response))
  } catch (err) {
    yield put(actions.retrieveFeedNextPageFail())
    yield put(notificationsActions.addAlert({
      message: err?.message,
      severity: 'error',
    }))
  }
}

function* retrieveCurrentFeedItem() {
  const currentItem: ReturnType<typeof selectCurrentFeedItem> = yield select(selectCurrentFeedItem)
  const entourageUuid: ReturnType<typeof selectCurrentFeedItemUuid> = yield select(selectCurrentFeedItemUuid)

  if (!currentItem && entourageUuid) {
    const dependencies: Dependencies = yield getContext('dependencies')
    const { retrieveFeedItem } = dependencies.feedGateway

    try {
      const response: CallReturnType<typeof retrieveFeedItem> = yield call(retrieveFeedItem, { entourageUuid })

      yield put(actions.insertFeedItem(response.item))
      if (response.item.groupType === 'outing' && response.item.online) {
        yield put(actions.retrieveFeed())
      } else {
        yield put(locationActions.setMapPosition({
          center: response.center,
          zoom: constants.DEFAULT_LOCATION.ZOOM,
        }))
        yield put(locationActions.setLocation({
          location: {
            center: response.center,
            displayAddress: response.displayAddress,
            zoom: constants.DEFAULT_LOCATION.ZOOM,
          },
        }))
      }
    } catch (err) {
      yield put(notificationsActions.addAlert({
        message: err?.message,
        severity: 'error',
      }))
    }
  }
}

function* createEntourage(action: FeedActions['createEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourage } = action.payload
  try {
    const response: CallReturnType<typeof feedGateway.createEntourage> = yield call(
      feedGateway.createEntourage,
      entourage,
    )
    yield put(actions.createEntourageSucceeded({ entourage: response }))
    if (action.payload.onCreateSucceeded) {
      action.payload.onCreateSucceeded(response.uuid)
    }
    const center = {
      lat: response.location.latitude,
      lng: response.location.longitude,
    }
    yield put(locationActions.setMapPosition({
      center,
      zoom: constants.DEFAULT_LOCATION.ZOOM,
    }))
    yield put(locationActions.setLocation({
      location: {
        center,
        displayAddress: response.metadata.displayAddress,
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      },
    }))
  } catch (err) {
    yield put(actions.createEntourageFailed())
    yield put(notificationsActions.addAlert({
      message: err?.message,
      severity: 'error',
    }))
  }
}

function* updateEntourage(action: FeedActions['updateEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid, entourage } = action.payload

  try {
    const response: CallReturnType<typeof feedGateway.updateEntourage> = yield call(
      feedGateway.updateEntourage,
      entourageUuid,
      entourage,
    )
    yield put(actions.updateEntourageSucceeded({ entourage: response }))
  } catch (err) {
    yield put(actions.updateEntourageFailed())
    yield put(notificationsActions.addAlert({
      message: err?.message,
      severity: 'error',
    }))
  }
}

function* joinEntourage(action: FeedActions['joinEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid } = action.payload

  try {
    const response: CallReturnType<typeof feedGateway.joinEntourage> = yield call(
      feedGateway.joinEntourage,
      entourageUuid,
    )
    yield put(actions.joinEntourageSucceeded({ entourageUuid, status: response.status }))
  } catch (err) {
    yield put(actions.joinEntourageFailed())
    yield put(notificationsActions.addAlert({
      message: err?.message,
      severity: 'error',
    }))
  }
}

function* leaveEntourage(action: FeedActions['leaveEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid, userId } = action.payload

  try {
    yield call(feedGateway.leaveEntourage, entourageUuid, userId)
    yield put(actions.leaveEntourageSucceeded({ entourageUuid }))
  } catch (err) {
    yield put(actions.leaveEntourageFailed())
    yield put(notificationsActions.addAlert({
      message: err?.message,
      severity: 'error',
    }))
  }
}

function* closeEntourage(action: FeedActions['closeEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid, success } = action.payload

  try {
    yield call(feedGateway.closeEntourage, entourageUuid, success)
    yield put(actions.closeEntourageSucceeded({ entourageUuid }))
  } catch (err) {
    yield put(actions.closeEntourageFailed())
    yield put(notificationsActions.addAlert({
      message: err?.message,
      severity: 'error',
    }))
  }
}

function* reopenEntourage(action: FeedActions['reopenEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid } = action.payload

  try {
    yield call(feedGateway.reopenEntourage, entourageUuid)
    yield put(actions.reopenEntourageSucceeded({ entourageUuid }))
  } catch (err) {
    yield put(actions.reopenEntourageFailed())
    yield put(notificationsActions.addAlert({
      message: err?.message,
      severity: 'error',
    }))
  }
}

function* retrieveEventImagesSaga() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveEventImages } = dependencies.feedGateway

  const eventImagesFetching: ReturnType<typeof selectEventImagesFetching> = yield select(selectEventImagesFetching)

  if (eventImagesFetching) {
    return
  }

  try {
    yield put(actions.retrieveEventImagesStarted())

    const response: CallReturnType<typeof retrieveEventImages> = yield call(
      retrieveEventImages,
    )

    yield put(actions.retrieveEventImagesSuccess(response))
  } catch (err) {
    yield put(actions.retrieveEventImagesFail())
    yield put(notificationsActions.addAlert({
      message: err?.message,
      severity: 'error',
    }))
  }
}

export function* feedSaga(): AnyGeneratorOutput {
  yield takeEvery(FeedActionType.RETRIEVE_FEED, retrieveFeed)
  yield takeEvery(FeedActionType.TOGGLE_ACTION_TYPES_FILTER, retrieveFeed)
  yield takeEvery(FeedActionType.TOGGLE_EVENTS_FILTER, retrieveFeed)
  yield takeEvery(FeedActionType.SET_TIME_RANGE_FILTER, retrieveFeed)
  yield takeEvery(FeedActionType.RETRIEVE_FEED_NEXT_PAGE, retrieveFeedNextPage)
  yield takeEvery(FeedActionType.CREATE_ENTOURAGE, createEntourage)
  yield takeEvery(FeedActionType.UPDATE_ENTOURAGE, updateEntourage)
  yield takeEvery(FeedActionType.JOIN_ENTOURAGE, joinEntourage)
  yield takeEvery(FeedActionType.LEAVE_ENTOURAGE, leaveEntourage)
  yield takeEvery(FeedActionType.CLOSE_ENTOURAGE, closeEntourage)
  yield takeEvery(FeedActionType.REOPEN_ENTOURAGE, reopenEntourage)
  yield takeEvery(FeedActionType.RETRIEVE_EVENT_IMAGES, retrieveEventImagesSaga)

  while (yield take(FeedActionType.INIT_FEED)) {
    const setLocationRetrieveFeed = yield takeEvery(LocationActionType.SET_LOCATION, retrieveFeed)
    const retrieveDataRetrieveFeed = yield takeEvery(LocationActionType.RETRIEVE_RELEVANT_DATA, retrieveFeed)
    const retrieveItemRetrieveFeedItem = yield takeEvery(
      LocationActionType.RETRIEVE_SELECTED_ITEM_DETAILS,
      retrieveCurrentFeedItem,
    )
    yield take(FeedActionType.CANCEL_FEED)
    yield cancel(setLocationRetrieveFeed)
    yield cancel(retrieveDataRetrieveFeed)
    yield cancel(retrieveItemRetrieveFeedItem)
  }
}
