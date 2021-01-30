import { call, put, select, getContext, cancel, take } from 'redux-saga/effects'
import { CallReturnType } from '../../utils/CallReturnType'
import { positionActions, selectPosition } from '../position'
import { PositionActionType } from '../position/position.actions'
import { takeEvery } from 'src/core/utils/takeEvery'
import { IFeedGateway } from './IFeedGateway'
import { FeedActionType, actions, FeedActions } from './feed.actions'
import { FeedState } from './feed.reducer'
import { selectCurrentItem, selectFeed } from './feed.selectors'

interface AppState {
  feed: FeedState;
}

export interface Dependencies {
  feedGateway: IFeedGateway;
}

function* retrieveFeed() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveFeedItems } = dependencies.feedGateway
  const feedState: ReturnType<typeof selectFeed> = yield select(selectFeed)
  const positionState: ReturnType<typeof selectPosition> = yield select(selectPosition)
  const { nextPageToken, fetching } = feedState
  const { zoom, center } = positionState

  if (fetching) {
    return
  }

  yield put(actions.retrieveFeedStarted())

  const response: CallReturnType<typeof retrieveFeedItems> = yield call(
    retrieveFeedItems,
    {
      filters: { center, zoom },
      nextPageToken: nextPageToken || undefined,
    },
  )
  yield put(actions.retrieveFeedSuccess(response))
}

function* retrieveFeedNextPage() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveFeedItems } = dependencies.feedGateway
  const feedState: ReturnType<typeof selectFeed> = yield select(selectFeed)
  const positionState: ReturnType<typeof selectPosition> = yield select(selectPosition)
  const { nextPageToken, fetching } = feedState
  const { zoom, center } = positionState

  if (!nextPageToken || fetching) {
    return
  }

  yield put(actions.retrieveFeedNextPageStarted())

  const response: CallReturnType<typeof retrieveFeedItems> = yield call(
    retrieveFeedItems,
    {
      filters: { center, zoom },
      nextPageToken: nextPageToken || undefined,
    },
  )
  yield put(actions.retrieveFeedNextPageSuccess(response))
}

function* setCurrentItemUuid(action: FeedActions['setCurrentItemUuid']) {
  const currentItem: ReturnType<typeof selectCurrentItem> = yield select(selectCurrentItem)
  const entourageUuid = action.payload

  if (!currentItem && entourageUuid) {
    const dependencies: Dependencies = yield getContext('dependencies')
    const { retrieveFeedItem } = dependencies.feedGateway
    const response: CallReturnType<typeof retrieveFeedItem> = yield call(retrieveFeedItem, { entourageUuid })
    yield put(positionActions.setPosition({ center: response.center, cityName: response.cityName }))
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
  yield takeEvery(FeedActionType.RETRIEVE_FEED_NEXT_PAGE, retrieveFeedNextPage)
  yield takeEvery(FeedActionType.SET_CURRENT_ITEM_UUID, setCurrentItemUuid)
  yield takeEvery(FeedActionType.JOIN_ENTOURAGE, joinEntourage)
  yield takeEvery(FeedActionType.LEAVE_ENTOURAGE, leaveEntourage)
  yield takeEvery(FeedActionType.CLOSE_ENTOURAGE, closeEntourage)
  yield takeEvery(FeedActionType.REOPEN_ENTOURAGE, reopenEntourage)
  while (yield take(FeedActionType.INIT_FEED)) {
    const bgRetrieveFeed = yield takeEvery(PositionActionType.SET_POSITION, retrieveFeed)
    yield take(FeedActionType.CANCEL_FEED)
    yield cancel(bgRetrieveFeed)
  }
}
