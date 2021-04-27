import { call, put, select, getContext, cancel, take } from 'redux-saga/effects'
import { CommonActionType } from '../common'
import { Cities, entourageCities, locationActions, selectLocation, selectLocationIsInit } from '../location'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { formatFeedTypes } from 'src/utils/misc'
import { IFeedGateway } from './IFeedGateway'
import { FeedActionType, actions, FeedActions } from './feed.actions'
import { selectCurrentFeedItem, selectFeed, selectFeedIsIdle } from './feed.selectors'

export interface Dependencies {
  feedGateway: IFeedGateway;
}

function* retrieveFeed() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveFeedItems } = dependencies.feedGateway
  const feedState: ReturnType<typeof selectFeed> = yield select(selectFeed)
  const positionState: ReturnType<typeof selectLocation> = yield select(selectLocation)
  const { nextPageToken, fetching, filters } = feedState
  const { zoom, center } = positionState

  if (fetching) {
    return
  }

  yield put(actions.retrieveFeedStarted())

  const types = formatFeedTypes(filters.actionTypes, filters.events)

  const response: CallReturnType<typeof retrieveFeedItems> = yield call(
    retrieveFeedItems,
    {
      filters: { types, location: { center, zoom }, timeRange: filters.timeRange },
      nextPageToken: nextPageToken || undefined,
    },
  )
  yield put(actions.retrieveFeedSuccess(response))
  yield put(locationActions.setMapHasMoved(false))
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
}

function* setCurrentItemUuid(action: FeedActions['setCurrentItemUuid']) {
  const currentItem: ReturnType<typeof selectCurrentFeedItem> = yield select(selectCurrentFeedItem)
  const feedIsIdle: ReturnType<typeof selectFeedIsIdle> = yield select(selectFeedIsIdle)
  const locationIsInit: ReturnType<typeof selectLocationIsInit> = yield select(selectLocationIsInit)
  const entourageUuid = action.payload

  if (!currentItem && entourageUuid) {
    const isCityId = entourageCities[entourageUuid as Cities]

    if (isCityId) {
      yield put(locationActions.initLocation())
    } else {
      const dependencies: Dependencies = yield getContext('dependencies')
      const { retrieveFeedItem } = dependencies.feedGateway

      const response: CallReturnType<typeof retrieveFeedItem> = yield call(retrieveFeedItem, { entourageUuid })

      if (feedIsIdle) {
        yield put(locationActions.setLocation({
          location: {
            center: response.center,
            displayAddress: response.displayAddress,
          },
        }))
        yield put(actions.retrieveFeed())
      }
    }
  } else if (!entourageUuid) {
    if (locationIsInit) {
      yield put(actions.retrieveFeed())
    } else {
      yield put(locationActions.initLocation())
    }
  }
}

function* joinEntourage(action: FeedActions['joinEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid } = action.payload
  const response: CallReturnType<typeof feedGateway.joinEntourage> = yield call(
    feedGateway.joinEntourage,
    entourageUuid,
  )
  yield put(actions.joinEntourageSucceeded({ entourageUuid, status: response.status }))
}

function* leaveEntourage(action: FeedActions['leaveEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid, userId } = action.payload

  yield call(feedGateway.leaveEntourage, entourageUuid, userId)
  yield put(actions.leaveEntourageSucceeded({ entourageUuid }))
}

function* closeEntourage(action: FeedActions['closeEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid, success } = action.payload

  yield call(feedGateway.closeEntourage, entourageUuid, success)
  yield put(actions.closeEntourageSucceeded({ entourageUuid }))
}

function* reopenEntourage(action: FeedActions['reopenEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid } = action.payload

  yield call(feedGateway.reopenEntourage, entourageUuid)
  yield put(actions.reopenEntourageSucceeded({ entourageUuid }))
}

export function* feedSaga() {
  yield takeEvery(FeedActionType.RETRIEVE_FEED, retrieveFeed)
  yield takeEvery(FeedActionType.TOGGLE_ACTION_TYPES_FILTER, retrieveFeed)
  yield takeEvery(FeedActionType.TOGGLE_EVENTS_FILTER, retrieveFeed)
  yield takeEvery(FeedActionType.SET_TIME_RANGE_FILTER, retrieveFeed)
  yield takeEvery(FeedActionType.RETRIEVE_FEED_NEXT_PAGE, retrieveFeedNextPage)
  yield takeEvery(FeedActionType.SET_CURRENT_ITEM_UUID, setCurrentItemUuid)
  yield takeEvery(FeedActionType.JOIN_ENTOURAGE, joinEntourage)
  yield takeEvery(FeedActionType.LEAVE_ENTOURAGE, leaveEntourage)
  yield takeEvery(FeedActionType.CLOSE_ENTOURAGE, closeEntourage)
  yield takeEvery(FeedActionType.REOPEN_ENTOURAGE, reopenEntourage)
  while (yield take(FeedActionType.INIT_FEED)) {
    const bgRetrieveFeed = yield takeEvery(CommonActionType.FETCH_DATA, retrieveFeed)
    yield take(FeedActionType.CANCEL_FEED)
    yield cancel(bgRetrieveFeed)
  }
}
