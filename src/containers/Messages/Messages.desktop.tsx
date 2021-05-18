import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SplashScreen } from '../../components/SplashScreen'
import {
  messagesActions,
  selectConversationList,
  selectMessagesIsIdle,
} from 'src/core/useCases/messages'
import { ConversationDetail } from './ConversationDetail'
import { ConversationsList } from './ConversationsList'
import * as S from './Messages.styles'
import { useEntourageUuid } from './useEntourageUuid'

export function MessagesDesktop() {
  const conversations = useSelector(selectConversationList)
  const isIdle = useSelector(selectMessagesIsIdle)
  const dispatch = useDispatch()
  const entourageUuid = useEntourageUuid()
  const router = useRouter()
  const firstConversationId = conversations?.[0]?.id

  useEffect(() => {
    // TODO FIX THIS
    if (entourageUuid) {
      dispatch(messagesActions.retrieveConversations())
    } else if (!entourageUuid) {
      if (firstConversationId) {
        router.push('/messages/[messageId]', `/messages/${firstConversationId}`)
      } else {
        dispatch(messagesActions.retrieveConversations())
      }
    } else if (entourageUuid) {
      dispatch(messagesActions.retrieveConversations())
    }
  }, [dispatch, entourageUuid, firstConversationId, router])

  if (isIdle) {
    return (
      <SplashScreen />
    )
  }

  return (
    <S.Container>
      <ConversationsList entourageUuid={entourageUuid} />
      {entourageUuid ? (
        <S.ConversationDetailContainer>
          <ConversationDetail key={entourageUuid} entourageUuid={entourageUuid} />
        </S.ConversationDetailContainer>
      ) : null}
    </S.Container>
  )
}
