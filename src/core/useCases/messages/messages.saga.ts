import { call, put, select, getContext } from 'redux-saga/effects'
import { selectUser } from '../authUser'
import { AuthUserActionType } from '../authUser/authUser.actions'
import { notificationsActions } from '../notifications'
import { CallReturnType } from 'src/core/utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { IMessagesGateway } from './IMessagesGateway'
import { MessagesActionType, actions, MessagesActions } from './messages.actions'
import { MessagesErrorNoAcceptedInConversation } from './messages.errors'
import {
  selectConversationIsInList,
  selectCurrentConversation,
  selectCurrentConversationUuid,
  selectMessages,
  selectMessagesCurrentPage,
  selectMessagesIsIdle,
} from './messages.selectors'

export interface Dependencies {
  messagesGateway: IMessagesGateway;
}

function* retrieveConversationsSaga() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveConversations } = dependencies.messagesGateway
  const messagesState: ReturnType<typeof selectMessages> = yield select(selectMessages)

  const { fetching } = messagesState

  if (fetching) {
    return
  }

  yield put(actions.retrieveConversationsStarted())

  try {
    const response: CallReturnType<typeof retrieveConversations> = yield call(
      retrieveConversations,
      {
        page: 1,
      },
    )
    yield put(actions.retrieveConversationsSuccess(response))
    yield put(actions.retrieveConversationDetailsIfNeeded())
  } catch (err) {
    yield put(actions.retrieveConversationsFail())
    if (err instanceof Error) {
      yield put(notificationsActions.addAlert({
        message: err?.message,
        severity: 'error',
      }))
    } else {
      throw err
    }
  }
}

function* retrieveNextConversationsSaga() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveConversations } = dependencies.messagesGateway
  const messagesState: ReturnType<typeof selectMessages> = yield select(selectMessages)
  const currentPage: ReturnType<typeof selectMessagesCurrentPage> = yield select(selectMessagesCurrentPage)

  const { fetching } = messagesState

  if (fetching) {
    return
  }

  yield put(actions.retrieveConversationsStarted())

  try {
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
  } catch (err) {
    yield put(actions.retrieveConversationsFail())
    if (err instanceof Error) {
      yield put(notificationsActions.addAlert({
        message: err?.message,
        severity: 'error',
      }))
    } else {
      throw err
    }
  }
}

function* retrieveConversationListOrDetails() {
  const messagesIsIdle: ReturnType<typeof selectMessagesIsIdle> = yield select(selectMessagesIsIdle)

  if (messagesIsIdle) {
    yield put(actions.retrieveConversations())
  } else {
    yield put(actions.retrieveConversationDetailsIfNeeded())
  }
}

function* retrieveCurrentConversationMessagesSaga() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { retrieveConversationMessages } = dependencies.messagesGateway

  const entourageUuid: ReturnType<typeof selectCurrentConversationUuid> = yield select(selectCurrentConversationUuid)

  if (!entourageUuid) {
    yield put(actions.retrieveConversations())
  } else {
    yield put(actions.retrieveConversationMessagesStarted())

    try {
      const response: CallReturnType<typeof retrieveConversationMessages> = yield call(
        retrieveConversationMessages,
        {
          entourageUuid,
        },
      )
      yield put(actions.retrieveConversationMessagesSuccess({
        conversationUuid: entourageUuid,
        conversationMessages: response.conversationMessages,
      }))
      yield call(retrieveConversationListOrDetails)
    } catch (error) {
      if (error instanceof MessagesErrorNoAcceptedInConversation) {
        yield put(actions.retrieveConversationMessagesSuccess({
          conversationUuid: entourageUuid,
          conversationMessages: [],
        }))
        yield call(retrieveConversationListOrDetails)
        return
      }
      yield put(actions.retrieveConversationMessagesFail())
      if (error instanceof Error) {
        yield put(notificationsActions.addAlert({
          message: error?.message,
          severity: 'error',
        }))
      } else {
        throw error
      }
    }
  }
}

function* retrieveCurrentConversationDetailsIfNeededSaga() {
  const dependencies: Dependencies = yield getContext('dependencies')

  const entourageUuid: ReturnType<typeof selectCurrentConversationUuid> = yield select(selectCurrentConversationUuid)
  const currentConversationDetails: ReturnType<typeof selectCurrentConversation> = yield select(
    selectCurrentConversation,
  )
  const messagesIsIdle: ReturnType<typeof selectMessagesIsIdle> = yield select(selectMessagesIsIdle)

  const { retrieveConversation } = dependencies.messagesGateway

  if (!messagesIsIdle && entourageUuid && !currentConversationDetails) {
    try {
      const conversationDetails: CallReturnType<typeof retrieveConversation> = yield call(
        retrieveConversation,
        {
          entourageUuid,
        },
      )

      const mutatedConversationDetails = {
        ...conversationDetails,
        uuid: entourageUuid,
      }

      yield put(actions.insertConversation(mutatedConversationDetails))
    } catch (err) {
      if (err instanceof Error) {
        yield put(notificationsActions.addAlert({
          message: err?.message,
          severity: 'error',
        }))
      } else {
        throw err
      }
    }
  }
}

function* retrieveCurrentConversationOlderMessagesSaga(action: MessagesActions['retrieveOlderConversationMessages']) {
  const currentConversation: ReturnType<typeof selectCurrentConversation> = yield select(selectCurrentConversation)
  const messagesIsIdle: ReturnType<typeof selectMessagesIsIdle> = yield select(selectMessagesIsIdle)
  const entourageUuid: ReturnType<typeof selectCurrentConversationUuid> = yield select(selectCurrentConversationUuid)
  const before = action.payload?.before

  if (currentConversation && entourageUuid) {
    yield put(actions.retrieveConversationMessagesStarted())

    const dependencies: Dependencies = yield getContext('dependencies')
    const { retrieveConversationMessages } = dependencies.messagesGateway

    try {
      const response: CallReturnType<typeof retrieveConversationMessages> = yield call(
        retrieveConversationMessages,
        {
          entourageUuid,
          before: before ?? undefined,
        },
      )

      yield put(actions.retrieveConversationMessagesSuccess({
        conversationUuid: entourageUuid,
        conversationMessages: response.conversationMessages,
      }))

      if (messagesIsIdle) {
        yield put(actions.retrieveConversations())
      }
    } catch (err) {
      yield put(actions.retrieveConversationMessagesFail())
      if (err instanceof Error) {
        yield put(notificationsActions.addAlert({
          message: err?.message,
          severity: 'error',
        }))
      } else {
        throw err
      }
    }
  }
}

function* sendMessageSaga(action: MessagesActions['sendMessage']) {
  const entourageUuid: ReturnType<typeof selectCurrentConversationUuid> = yield select(selectCurrentConversationUuid)
  const conversationIsInList: ReturnType<typeof selectConversationIsInList> = yield select(selectConversationIsInList)

  const { message } = action.payload

  if (entourageUuid) {
    const dependencies: Dependencies = yield getContext('dependencies')
    const { sendMessage, retrieveConversationMessages, retrieveConversations } = dependencies.messagesGateway

    try {
      yield call(
        sendMessage,
        {
          entourageUuid,
          message,
        },
      )

      const responseMessages: CallReturnType<typeof retrieveConversationMessages> = yield call(
        retrieveConversationMessages,
        {
          entourageUuid,
        },
      )

      yield put(actions.retrieveConversationMessagesSuccess({
        conversationUuid: entourageUuid,
        conversationMessages: responseMessages.conversationMessages,
      }))

      if (!conversationIsInList) {
        const responseConversations: CallReturnType<typeof retrieveConversations> = yield call(
          retrieveConversations,
          {
            page: 1,
          },
        )

        yield put(actions.retrieveConversationsSuccess(responseConversations))
      }
    } catch (err) {
      if (err instanceof Error) {
        yield put(notificationsActions.addAlert({
          message: err?.message,
          severity: 'error',
        }))
      } else {
        throw err
      }
    }
  }
}

function* retrieveConversationsIfLoggedIn() {
  const user: ReturnType<typeof selectUser> = yield select(selectUser)

  if (user) {
    yield put(actions.retrieveConversations())
  }
}

export function* messagesSaga() {
  yield takeEvery(MessagesActionType.RETRIEVE_CONVERSATIONS, retrieveConversationsSaga)
  yield takeEvery(AuthUserActionType.SET_USER, retrieveConversationsIfLoggedIn)
  yield takeEvery(AuthUserActionType.LOGIN_WITH_PASSWORD_SUCCEEDED, retrieveConversationsIfLoggedIn)
  yield takeEvery(MessagesActionType.RETRIEVE_NEXT_CONVERSATIONS, retrieveNextConversationsSaga)
  yield takeEvery(
    MessagesActionType.RETRIEVE_CONVERSATION_DETAILS_IF_NEEDED,
    retrieveCurrentConversationDetailsIfNeededSaga,
  )

  yield takeEvery(MessagesActionType.SET_CURRENT_CONVERSATION_UUID, retrieveCurrentConversationMessagesSaga)
  yield takeEvery(MessagesActionType.RETRIEVE_CONVERSATION_MESSAGES, retrieveCurrentConversationMessagesSaga)
  yield takeEvery(MessagesActionType.RETRIEVE_OLDER_CONVERSATION_MESSAGES, retrieveCurrentConversationOlderMessagesSaga)
  yield takeEvery(MessagesActionType.SEND_MESSAGE, sendMessageSaga)
}
