import { call, put, select, getContext } from 'redux-saga/effects'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { IMessagesGateway } from './IMessagesGateway'
import { MessagesActionType, actions } from './messages.actions'
import {
  selectMessages,
  selectMessagesCurrentPage,
} from './messages.selectors'

export interface Dependencies {
  messagesGateway: IMessagesGateway;
}

function* retrieveConversationsSaga() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveConversations } = dependencies.messagesGateway
  const messagesState: ReturnType<typeof selectMessages> = yield select(selectMessages)
  const currentPage: ReturnType<typeof selectMessagesCurrentPage> = yield select(selectMessagesCurrentPage)

  const { fetching } = messagesState

  if (fetching) {
    return
  }

  yield put(actions.retrieveConversationsStarted())

  const response: CallReturnType<typeof retrieveConversations> = yield call(
    retrieveConversations,
    {
      page: currentPage,
    },
  )
  yield put(actions.retrieveConversationsSuccess(response))
  if (response.conversations.length === 0) {
    yield put(actions.decrementPageNumber())
  }
}
/*

function* retrieveCurrentPOI() {
  const currentPOI: ReturnType<typeof selectCurrentPOI> = yield select(selectCurrentPOI)
  const poisIsIdle: ReturnType<typeof selectMessagesIsIdle> = yield select(selectMessagesIsIdle)
  const poiUuid: ReturnType<typeof selectCurrentPOIUuid> = yield select(selectCurrentPOIUuid)

  if (!currentPOI && poiUuid) {
    yield put(actions.retrievePOIDetailsStarted())

    const dependencies: Dependencies = yield getContext('dependencies')
    const { retrievePOI } = dependencies.poisGateway

    const response: CallReturnType<typeof retrievePOI> = yield call(retrievePOI, { poiUuid })

    yield put(actions.retrievePOIDetailsSuccess(response))

    if (poisIsIdle) {
      yield put(locationActions.setMapPosition({
        center: {
          lat: response.poiDetails.latitude,
          lng: response.poiDetails.longitude,
        },
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      }))
      yield put(locationActions.setLocation({
        location: {
          center: {
            lat: response.poiDetails.latitude,
            lng: response.poiDetails.longitude,
          },
          displayAddress: response.poiDetails.address,
          zoom: constants.DEFAULT_LOCATION.ZOOM,
        },
      }))
    }
  }
}
*/

export function* messagesSaga() {
  yield takeEvery(MessagesActionType.RETRIEVE_CONVERSATIONS, retrieveConversationsSaga)
  yield takeEvery(MessagesActionType.RETRIEVE_NEXT_CONVERSATIONS, retrieveConversationsSaga)
}
