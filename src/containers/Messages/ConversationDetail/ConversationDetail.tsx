import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { Messages, TopBar } from 'src/components/Conversations'
import { openModal } from 'src/components/Modal'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { ModalUserCard } from 'src/containers/ModalUserCard'
import {
  useQueryEntourageChatMessages,
  useMutateCreateEntourageChatMessage,
  useQueryEntourageFromMyFeeds,
  useQueryEntourage,
  queryKeys,
} from 'src/core/store'
import { useMeNonNullable } from 'src/hooks/useMe'
import { assertIsDefined } from 'src/utils/misc'
import * as S from './ConversationDetail.styles'
import { MembersPendingRequest } from './MembersPendingRequest'

interface ConversationDetailProps {
  entourageUuid: string;
}

export function ConversationDetail(props: ConversationDetailProps) {
  const { entourageUuid } = props
  const router = useRouter()

  const entourageFromMyFeed = useQueryEntourageFromMyFeeds(entourageUuid)

  const entourageFromAPI = useQueryEntourage(entourageFromMyFeed ? undefined : entourageUuid)

  const entourage = entourageFromMyFeed || entourageFromAPI.data?.data.entourage
  const isNewConversation = !entourageFromMyFeed

  const joinStatus = entourage?.joinStatus
  const userIsAccepted = joinStatus === 'accepted'

  const { data: messages, fetchMore } = useQueryEntourageChatMessages(userIsAccepted ? entourageUuid : null)
  const [createcChatMessage] = useMutateCreateEntourageChatMessage(
    entourageUuid,
    isNewConversation ? [queryKeys.myFeeds] : undefined,
  )

  const me = useMeNonNullable()

  const onClickSend = useCallback(async (messageContent) => {
    await createcChatMessage({ content: messageContent }, { waitForRefetchQueries: true })
  }, [createcChatMessage])

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
  const reversedMessages = [...messages].reverse().map((message) => ({
    authorAvatarURL: message.user.avatarUrl,
    authorName: message.user.displayName,
    authorId: message.user.id,
    content: message.content,
    date: message.createdAt,
    id: message.id,
  }))

  if (!entourage) {
    return <OverlayLoader />
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
          vous verrez ici la conversation des participants à cette action/cet évènement.
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
