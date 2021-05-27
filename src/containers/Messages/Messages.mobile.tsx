import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SplashScreen } from 'src/components/SplashScreen'
import { messagesActions, selectMessagesIsIdle } from 'src/core/useCases/messages'
import { ConversationDetail } from './ConversationDetail'
import { ConversationsList } from './ConversationsList'
import * as S from './Messages.styles'
import { useEntourageUuid } from './useEntourageUuid'

export function MessagesMobile() {
  const isIdle = useSelector(selectMessagesIsIdle)
  const dispatch = useDispatch()
  const entourageUuid = useEntourageUuid()

  useEffect(() => {
    dispatch(messagesActions.setCurrentConversationUuid(entourageUuid || null))
  }, [dispatch, entourageUuid])

  if (isIdle) {
    return (
      <SplashScreen />
    )
  }

  return (
    <S.Container>
      {entourageUuid ? <ConversationDetail key={entourageUuid} entourageUuid={entourageUuid} /> : <ConversationsList />}
    </S.Container>
  )
}
