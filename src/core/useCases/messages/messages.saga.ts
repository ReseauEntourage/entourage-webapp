import { call, put, select, getContext } from 'redux-saga/effects'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { IMessagesGateway } from './IMessagesGateway'
import { MessagesActionType, actions, MessagesActions } from './messages.actions'
import {
  selectCurrentConversation, selectCurrentConversationMessages,
  selectCurrentConversationUuid,
  selectMessages,
  selectMessagesCurrentPage, selectMessagesIsIdle,
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

function* retrieveCurrentConversationMessages() {
  const currentConversationMessages: ReturnType<
    typeof selectCurrentConversationMessages
  > = yield select(
    selectCurrentConversationMessages,
  )
  const messagesIsIdle: ReturnType<typeof selectMessagesIsIdle> = yield select(selectMessagesIsIdle)
  const entourageUuid: ReturnType<typeof selectCurrentConversationUuid> = yield select(selectCurrentConversationUuid)

  if (!entourageUuid) {
    yield put(actions.retrieveConversations())
  } else if (!currentConversationMessages && entourageUuid) {
    yield put(actions.retrieveConversationMessagesStarted())

    const dependencies: Dependencies = yield getContext('dependencies')
    const { retrieveConversationMessages } = dependencies.messagesGateway

    const response: CallReturnType<typeof retrieveConversationMessages> = yield call(retrieveConversationMessages,
      {
        entourageUuid,
      })

    yield put(actions.retrieveConversationMessagesSuccess({
      conversationUuid: entourageUuid,
      conversationMessages: response.conversationMessages,
    }))

    if (messagesIsIdle) {
      yield put(actions.retrieveConversations())
    }
  }
}

function* retrieveCurrentConversationOlderMessages(action: MessagesActions['retrieveOlderConversationMessages']) {
  const currentConversation: ReturnType<typeof selectCurrentConversation> = yield select(selectCurrentConversation)
  const messagesIsIdle: ReturnType<typeof selectMessagesIsIdle> = yield select(selectMessagesIsIdle)
  const entourageUuid: ReturnType<typeof selectCurrentConversationUuid> = yield select(selectCurrentConversationUuid)
  const before = action.payload?.before

  if (currentConversation && entourageUuid) {
    yield put(actions.retrieveConversationMessagesStarted())

    const dependencies: Dependencies = yield getContext('dependencies')
    const { retrieveConversationMessages } = dependencies.messagesGateway

    const response: CallReturnType<typeof retrieveConversationMessages> = yield call(retrieveConversationMessages,
      {
        entourageUuid,
        before: before ?? undefined,
      })

    yield put(actions.retrieveConversationMessagesSuccess({
      conversationUuid: entourageUuid,
      conversationMessages: response.conversationMessages,
    }))

    if (messagesIsIdle) {
      yield put(actions.retrieveConversations())
    }
  }
}

function* sendMessageSaga(action: MessagesActions['sendMessage']) {
  const entourageUuid: ReturnType<typeof selectCurrentConversationUuid> = yield select(selectCurrentConversationUuid)
  const conversationMessages: ReturnType<
    typeof selectCurrentConversationMessages
  > = yield select(
    selectCurrentConversationMessages,
  )
  const { message } = action.payload

  if (entourageUuid) {
    yield put(actions.retrieveConversationMessagesStarted())

    const dependencies: Dependencies = yield getContext('dependencies')
    const { sendMessage, retrieveConversationMessages, retrieveConversations } = dependencies.messagesGateway

    yield call(sendMessage,
      {
        entourageUuid,
        message,
      })

    const responseMessages: CallReturnType<
      typeof retrieveConversationMessages
    > = yield call(
      retrieveConversationMessages,
      {
        entourageUuid,
      },
    )

    yield put(actions.retrieveConversationMessagesSuccess({
      conversationUuid: entourageUuid,
      conversationMessages: responseMessages.conversationMessages,
    }))

    if (!conversationMessages || conversationMessages.length === 0) {
      const responseConversation: CallReturnType<
        typeof retrieveConversations
      > = yield call(
        retrieveConversations,
        {
          page: 1,
        },
      )

      yield put(actions.retrieveConversationsSuccess({
        conversations: responseConversation.conversations,
      }))
    }
  }
}

export function* messagesSaga() {
  yield takeEvery(MessagesActionType.RETRIEVE_CONVERSATIONS, retrieveConversationsSaga)
  yield takeEvery(MessagesActionType.RETRIEVE_NEXT_CONVERSATIONS, retrieveConversationsSaga)

  yield takeEvery(MessagesActionType.SET_CURRENT_CONVERSATION_UUID, retrieveCurrentConversationMessages)
  yield takeEvery(MessagesActionType.RETRIEVE_OLDER_CONVERSATION_MESSAGES, retrieveCurrentConversationOlderMessages)
  yield takeEvery(MessagesActionType.SEND_MESSAGE, sendMessageSaga)
}
