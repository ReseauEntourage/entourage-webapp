import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SplashScreen } from 'src/components/SplashScreen'
import { messagesActions, selectConversationList, selectMessagesIsIdle } from 'src/core/useCases/messages'
import { ConversationDetail } from './ConversationDetail'
import { ConversationsList } from './ConversationsList'
import * as S from './Messages.styles'
import { NoMessages } from './NoMessages'
import { useEntourageUuid } from './useEntourageUuid'

export function MessagesMobile() {
  const conversations = useSelector(selectConversationList)

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

  const detailOrListComponent = (entourageUuid
    ? <ConversationDetail key={entourageUuid} entourageUuid={entourageUuid} />
    : <ConversationsList />
  )

  return (
    <S.Container>
      {
        conversations && conversations.length === 0 ? (<NoMessages />) : detailOrListComponent
      }
    </S.Container>
  )
}
