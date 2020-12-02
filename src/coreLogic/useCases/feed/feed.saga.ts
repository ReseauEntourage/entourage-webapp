import { call, put, takeEvery, select, getContext } from 'redux-saga/effects'
import { CallReturnType } from '../../utils/CallReturnType'
import { IFeedGateway } from './IFeedGateway'
import { ActionType, actions, Actions } from './feed.actions'
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
  const { filters: { zoom, center }, nextPageToken } = feedState

  const response: CallReturnType<typeof retrieveFeedItems> = yield call(
    retrieveFeedItems,
    { filters: { center, zoom },
      nextPageToken: nextPageToken || undefined,
    },
  )
  yield put(actions.retrieveFeedSuccess(response))
}

function* retrieveFeedNextPage() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveFeedItems } = dependencies.feedGateway
  const { filters: { center, zoom }, nextPageToken }: ReturnType<typeof selectFeed> = yield select(selectFeed)

  if (!nextPageToken) {
    return
  }

  const response: CallReturnType<typeof retrieveFeedItems> = yield call(
    retrieveFeedItems,
    { filters: { center, zoom },
      nextPageToken: nextPageToken || undefined,
    },
  )
  yield put(actions.retrieveFeedNextPageSuccess(response))
}

function* setCurrentItemUuid(action: Actions['setCurrentItemUuid']) {
  const currentItem: ReturnType<typeof selectCurrentItem> = yield select(selectCurrentItem)
  const entourageUuid = action.payload

  if (!currentItem && entourageUuid) {
    const dependencies: Dependencies = yield getContext('dependencies')
    const { retrieveFeedItem } = dependencies.feedGateway
    const response: CallReturnType<typeof retrieveFeedItem> = yield call(retrieveFeedItem, { entourageUuid })
    yield put(actions.setFilters({ center: response.center, cityName: response.cityName }))
  }
}

function* joinEntourage(action: Actions['joinEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid } = action.payload

  yield call(feedGateway.joinEntourage, entourageUuid)
  yield put(actions.joinEntourageSucceeded({ entourageUuid }))
}

function* leaveEntourage(action: Actions['leaveEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid, userId } = action.payload

  yield call(feedGateway.leaveEntourage, entourageUuid, userId)
  yield put(actions.leaveEntourageSucceeded({ entourageUuid }))
}

export function* feedSaga() {
  yield takeEvery(ActionType.RETRIEVE_FEED, retrieveFeed)
  yield takeEvery(ActionType.SET_FILTERS, retrieveFeed)
  yield takeEvery(ActionType.RETRIEVE_FEED_NEXT_PAGE, retrieveFeedNextPage)
  yield takeEvery(ActionType.SET_CURRENT_ITEM_UUID, setCurrentItemUuid)
  yield takeEvery(ActionType.JOIN_ENTOURAGE, joinEntourage)
  yield takeEvery(ActionType.LEAVE_ENTOURAGE, leaveEntourage)
}
