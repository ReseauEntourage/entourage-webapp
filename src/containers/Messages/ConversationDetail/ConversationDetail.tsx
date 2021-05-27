import Box from '@material-ui/core/Box'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Messages, TopBar } from 'src/components/Conversations'
import { openModal } from 'src/components/Modal'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { ModalUserCard } from 'src/containers/ModalUserCard'
import {
  messagesActions,
  selectConversationIsInList,
  selectCurrentConversation,
  selectCurrentConversationMessages,
} from 'src/core/useCases/messages'
import { useMeNonNullable } from 'src/hooks/useMe'
import { useFirebase } from 'src/utils/hooks'
import { assertIsDefined } from 'src/utils/misc'
import * as S from './ConversationDetail.styles'
import { MembersPendingRequest } from './MembersPendingRequest'

interface ConversationDetailProps {
  entourageUuid: string;
}

export function ConversationDetail(props: ConversationDetailProps) {
  const dispatch = useDispatch()
  const { entourageUuid } = props
  const router = useRouter()
  const conversationIsInList = useSelector(selectConversationIsInList)
  const currentConversation = useSelector(selectCurrentConversation)
  const messages = useSelector(selectCurrentConversationMessages)

  const entourage = currentConversation
  const isNewConversation = !conversationIsInList

  const joinStatus = entourage?.joinStatus
  const userIsAccepted = joinStatus === 'accepted'

  const fetchMore = useCallback(() => {
    dispatch(messagesActions.retrieveNextConversations())
  }, [dispatch])

  const me = useMeNonNullable()

  const { sendEvent } = useFirebase()

  const onClickSend = useCallback(async (messageContent) => {
    sendEvent('Action__Messages__WriteMessage')
    dispatch(messagesActions.sendMessage({ message: messageContent }))
  }, [dispatch, sendEvent])

  const onClickTopBar = useCallback(() => {
    assertIsDefined(entourage)

    if (entourage.groupType === 'action' || entourage.groupType === 'outing') {
      router.push('/actions/[actionId]', `/actions/${entourage.uuid}`)
    } else if (entourage.groupType === 'conversation' && entourage.author.id) {
      openModal(<ModalUserCard userId={entourage.author.id} />)
    }
  }, [entourage, router])

  const onClickBackToMessages = useCallback(() => router.push('/messages'), [router])

  // must make a shallow copy because reverse() will mutate
  // and messages is cached
  const reversedMessages = messages ? [...messages].reverse().map((message) => ({
    authorAvatarURL: message.user.avatarUrl,
    authorName: message.user.displayName,
    authorId: message.user.id,
    content: message.content,
    date: message.createdAt,
    id: message.id,
  })) : []

  if (!entourage) {
    return (
      <S.Container>
        <Box alignItems="center" display="flex" height="100%" justifyContent="center">
          <OverlayLoader />
        </Box>
      </S.Container>
    )
  }

  if (joinStatus !== 'accepted' && joinStatus !== 'pending') {
    throw new Error(`Entourage with joins status ${joinStatus} shouldn't be in /myfeeds`)
  }

  const { title } = entourage

  return (
    <S.Container>
      <TopBar
        onClickBackToMessages={onClickBackToMessages}
        onClickTopBar={onClickTopBar}
        title={title}
      />
      {!isNewConversation && (
        <MembersPendingRequest entourageUuid={entourageUuid} />
      )}
      {!userIsAccepted ? (
        <S.Pending>
          Votre demande est en attente. Lorsque vous serez accepté.e,
          vous verrez ici la conversation des participants à
          {entourage.groupType === 'action' ? 'cette action' : 'cet évènement'}.
        </S.Pending>
      ) : (
        <S.MessagesContainer>
          <Messages
            fetchMore={fetchMore}
            messages={reversedMessages}
            meUserId={me.id}
            onSendMessage={onClickSend}
          />
        </S.MessagesContainer>
      )}
    </S.Container>
  )
}
