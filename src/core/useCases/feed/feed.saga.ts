import { normalize } from 'normalizr'
import { call, put, select, getContext } from 'redux-saga/effects'
import { CallReturnType } from '../../utils/CallReturnType'
import { entitiesActions } from '../entities'
import { entourageSchema } from '../entities/entities.schemas'
import { schema } from 'src/core/api'
import { takeEvery } from 'src/core/utils/takeEvery'
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
  const { filters: { zoom, center }, nextPageToken, fetching } = feedState

  if (fetching) {
    return
  }

  yield put(actions.retrieveFeedStarted())

  const response: CallReturnType<typeof retrieveFeedItems> = yield call(
    retrieveFeedItems,
    { filters: { center, zoom },
      nextPageToken: nextPageToken || undefined,
    },
  )
  const { entities, result } = normalize({ feeds: response.items }, schema['/feeds GET'].normalizrSchema())
  yield put(entitiesActions.updateEntities({ entities }))

  const payload = {
    nextPageToken: response.nextPageToken,
    itemsUuids: result.feeds,
  }
  yield put(actions.retrieveFeedSuccess(payload))
}

function* retrieveFeedNextPage() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveFeedItems } = dependencies.feedGateway
  const { filters: { center, zoom }, nextPageToken, fetching }: ReturnType<typeof selectFeed> = yield select(selectFeed)

  if (!nextPageToken || fetching) {
    return
  }

  yield put(actions.retrieveFeedNextPageStarted())

  const response: CallReturnType<typeof retrieveFeedItems> = yield call(
    retrieveFeedItems,
    { filters: { center, zoom },
      nextPageToken: nextPageToken || undefined,
    },
  )
  const { entities, result } = normalize(response.items, [entourageSchema])
  yield put(entitiesActions.updateEntities({ entities }))

  const payload = {
    nextPageToken: response.nextPageToken,
    itemsUuids: result,
  }
  yield put(actions.retrieveFeedNextPageSuccess(payload))
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

function* setFilters() {
  yield put(actions.retrieveFeed())
}

function* joinEntourage(action: Actions['joinEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid } = action.payload
  const response: CallReturnType<typeof feedGateway.joinEntourage> = yield call(
    feedGateway.joinEntourage,
    entourageUuid,
  )
  yield put(actions.joinEntourageSucceeded({ entourageUuid, status: response.status }))
}

function* leaveEntourage(action: Actions['leaveEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid, userId } = action.payload

  yield call(feedGateway.leaveEntourage, entourageUuid, userId)
  yield put(actions.leaveEntourageSucceeded({ entourageUuid }))
}

function* closeEntourage(action: Actions['closeEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid, success } = action.payload

  yield call(feedGateway.closeEntourage, entourageUuid, success)
  yield put(actions.closeEntourageSucceeded({ entourageUuid }))
}

function* reopenEntourage(action: Actions['reopenEntourage']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { feedGateway } = dependencies
  const { entourageUuid } = action.payload

  yield call(feedGateway.reopenEntourage, entourageUuid)
  yield put(actions.reopenEntourageSucceeded({ entourageUuid }))
}

export function* feedSaga() {
  yield takeEvery(ActionType.RETRIEVE_FEED, retrieveFeed)
  yield takeEvery(ActionType.SET_FILTERS, setFilters)
  yield takeEvery(ActionType.RETRIEVE_FEED_NEXT_PAGE, retrieveFeedNextPage)
  yield takeEvery(ActionType.SET_CURRENT_ITEM_UUID, setCurrentItemUuid)
  yield takeEvery(ActionType.JOIN_ENTOURAGE, joinEntourage)
  yield takeEvery(ActionType.LEAVE_ENTOURAGE, leaveEntourage)
  yield takeEvery(ActionType.CLOSE_ENTOURAGE, closeEntourage)
  yield takeEvery(ActionType.REOPEN_ENTOURAGE, reopenEntourage)
}
