import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { Messages, TopBar } from 'src/components/Conversations'
import {
  useQueryMe,
  useQueryEntourageChatMessages,
  useMutateCreateEntourageChatMessage,
  useQueryEntourageFromMyFeeds,
} from 'src/core/store'
import * as S from './ConversationDetail.styles'
import { MembersPendingRequest } from './MembersPendingRequest'

interface ConversationDetailProps {
  entourageId: number;
}

export function ConversationDetail(props: ConversationDetailProps) {
  const { entourageId } = props
  const router = useRouter()

  const entourage = useQueryEntourageFromMyFeeds(entourageId)

  const { joinStatus } = entourage
  const userIsAccepted = joinStatus === 'accepted'

  if (joinStatus !== 'accepted' && joinStatus !== 'pending') {
    throw new Error(`Entourage with joins status ${joinStatus} shouldn't be in /myfeeds`)
  }

  const { data: messages, fetchMore } = useQueryEntourageChatMessages(userIsAccepted ? entourageId : null)
  const [createcChatMessage] = useMutateCreateEntourageChatMessage(entourageId)
  const { data: meData } = useQueryMe()

  const onClickSend = useCallback(async (messageContent) => {
    await createcChatMessage({ content: messageContent }, { waitForRefetchQueries: true })
  }, [createcChatMessage])

  const onClickTopBar = useCallback(() => {
    if (entourage.groupType === 'action' || entourage.groupType === 'outing') {
      router.push(`/actions/${entourage.uuid}`)
    }
  }, [entourage.groupType, entourage.uuid, router])

  // must make a shallow copy because reverse() will mutate
  // and messages is cached
  const reversedMessages = [...messages].reverse().map((message) => ({
    authorAvatarURL: message.user.avatarUrl,
    authorName: message.user.displayName,
    authorId: message.user.id,
    content: message.content,
    date: message.createdAt,
    id: message.id,
  }))

  return (
    <S.Container>
      <TopBar
        onClickTopBar={onClickTopBar}
        title={`${entourage.title} - ${entourage.description}`}
      />
      <MembersPendingRequest entourageId={entourageId} />
      {!userIsAccepted ? (
        <S.Pending>
          Votre demande est en attente. Lorsque vous serez accepté.e,
          vous verrez ici la conversation des participants à cette action/cet évènement.
        </S.Pending>
      ) : (
        <Messages
          fetchMore={fetchMore}
          messages={reversedMessages}
          meUserId={meData?.data.user.id}
          onSendMessage={onClickSend}
        />
      )}
    </S.Container>
  )
}
