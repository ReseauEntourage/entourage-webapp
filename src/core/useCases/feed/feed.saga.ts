import { call, put, select, getContext, cancel, take } from 'redux-saga/effects'
import { locationActions, selectLocation } from '../location'
import { LocationActionType } from '../location/location.actions'
import { constants } from 'src/constants'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { formatFeedTypes } from 'src/utils/misc'
import { IFeedGateway } from './IFeedGateway'
import { FeedActionType, actions, FeedActions } from './feed.actions'
import { selectCurrentFeedItem, selectCurrentFeedItemUuid, selectFeed, selectFeedIsIdle } from './feed.selectors'

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

function* retrieveCurrentFeedItem() {
  const currentItem: ReturnType<typeof selectCurrentFeedItem> = yield select(selectCurrentFeedItem)
  const feedIsIdle: ReturnType<typeof selectFeedIsIdle> = yield select(selectFeedIsIdle)
  const entourageUuid: ReturnType<typeof selectCurrentFeedItemUuid> = yield select(selectCurrentFeedItemUuid)

  if (!currentItem && entourageUuid) {
    yield put(actions.retrieveFeedItemDetailsStarted())
    const dependencies: Dependencies = yield getContext('dependencies')
    const { retrieveFeedItem } = dependencies.feedGateway

    const response: CallReturnType<typeof retrieveFeedItem> = yield call(retrieveFeedItem, { entourageUuid })

    yield put(actions.insertFeedItem(response.item))

    if (feedIsIdle) {
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
  yield takeEvery(FeedActionType.JOIN_ENTOURAGE, joinEntourage)
  yield takeEvery(FeedActionType.LEAVE_ENTOURAGE, leaveEntourage)
  yield takeEvery(FeedActionType.CLOSE_ENTOURAGE, closeEntourage)
  yield takeEvery(FeedActionType.REOPEN_ENTOURAGE, reopenEntourage)

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
