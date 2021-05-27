import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { SplashScreen } from 'src/components/SplashScreen'
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
  const firstConversationId = conversations?.[0]?.uuid

  useEffect(() => {
    if (!entourageUuid) {
      if (firstConversationId) {
        router.push('/messages/[messageId]', `/messages/${firstConversationId}`)
      } else {
        dispatch(messagesActions.retrieveConversations())
      }
    }
  }, [dispatch, entourageUuid, firstConversationId, router])

  useEffect(() => {
    if (entourageUuid) {
      dispatch(messagesActions.setCurrentConversationUuid(entourageUuid || null))
    }
  }, [dispatch, entourageUuid])

  if (isIdle) {
    return (
      <SplashScreen />
    )
  }

  return (
    <S.Container>
      <ConversationsList entourageUuid={entourageUuid} />
      <S.ConversationDetailContainer>
        {
          entourageUuid
            ? <ConversationDetail key={entourageUuid} entourageUuid={entourageUuid} />
            : <OverlayLoader />
        }
      </S.ConversationDetailContainer>
    </S.Container>
  )
}
