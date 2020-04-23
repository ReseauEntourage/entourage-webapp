import SendIcon from '@material-ui/icons/Send'
import React, { useCallback, useEffect, useRef } from 'react'
import { Button } from 'src/components/Button'
import { Message } from 'src/components/Conversations'
import { TextField, useForm } from 'src/components/Form'
import {
  useQueryMe,
  useQueryEntourageChatMessages,
  useMutateCreateEntourageChatMessage,
  useQueryEntourageFromMyFeeds,
} from 'src/core/store'
import { theme } from 'src/styles'
import { useOnScroll, usePrevious } from 'src/utils/hooks'
import {
  Container,
  MessagesContainer,
  BottomBar,
  TopBar,
  Pending,
} from './ConversationDetail.styles'
import { MembersPendingRequest } from './MembersPendingRequest'

interface FormFields {
  content: string;
}

interface ConversationDetail {
  entourageId: number;
}

export function ConversationDetail(props: ConversationDetail) {
  const { entourageId } = props

  const { register, triggerValidation, getValues, setValue } = useForm<FormFields>()
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  const entourage = useQueryEntourageFromMyFeeds(entourageId)

  const { joinStatus } = entourage
  const userIsAccepted = joinStatus === 'accepted'

  if (joinStatus !== 'accepted' && joinStatus !== 'pending') {
    throw new Error(`Entourage with joins status ${joinStatus} shouldn't be in /myfeeds`)
  }

  const {
    data: chatMessages,
    isLoading,
    fetchMore,
  } = useQueryEntourageChatMessages(userIsAccepted ? entourageId : null)
  const [createcChatMessage] = useMutateCreateEntourageChatMessage(entourageId)
  const { data: meData } = useQueryMe()

  const onClickSend = useCallback(async () => {
    if (!await triggerValidation()) {
      return
    }

    await createcChatMessage({ content: getValues().content }, { waitForRefetchQueries: true })

    setValue('content', '')
  }, [createcChatMessage, getValues, setValue, triggerValidation])

  const messages = chatMessages
  // must make a shallow copy because reverse() will mutate
  // and chatMessages is cached
  const reversedMessages = [...messages].reverse()

  const { onScroll, isAtBottom, isAtTop } = useOnScroll()

  const lastMessage = messages.length && messages[0]
  const prevLastMessage = usePrevious(lastMessage)
  const lastMessageHasChanged = lastMessage && prevLastMessage && lastMessage.id !== prevLastMessage.id

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messagesContainerRef])

  useEffect(() => {
    if (isAtBottom && lastMessageHasChanged) {
      scrollToBottom()
    }
  }, [isAtBottom, lastMessageHasChanged, scrollToBottom])

  const isAtTopPrev = usePrevious(isAtTop)
  const fetchMoreIsNeeded = isAtTop && isAtTopPrev === false
  const messagesListIsNotEmpty = !!messages.length

  useEffect(() => {
    if (!isLoading && messagesListIsNotEmpty) {
      scrollToBottom()
    }
  }, [scrollToBottom, isLoading, messagesListIsNotEmpty])

  useEffect(() => {
    if (fetchMoreIsNeeded) {
      fetchMore()
    }
  }, [fetchMoreIsNeeded, fetchMore])

  return (
    <Container>
      <TopBar>
        {entourage.title}
      </TopBar>
      <MembersPendingRequest entourageId={entourageId} />
      {!userIsAccepted ? (
        <Pending>
          Votre demande est en attente. Lorsque vous serez accepté.e,
          vous verrez ici la conversation des participants à cette action/cet évènement.
        </Pending>
      ) : (
        <>
          <MessagesContainer ref={messagesContainerRef} onScroll={onScroll}>
            {reversedMessages.map((message) => {
              const isMe = message.user.id === meData?.data.user.id
              return (
                <Message
                  key={message.id}
                  author={message.user.displayName || undefined}
                  content={message.content}
                  date={message.createdAt}
                  isMe={isMe}
                />
              )
            })}
            {/* </ScrollToBottom> */}
          </MessagesContainer>
          <BottomBar>
            <TextField
              inputRef={register({ required: true })}
              margin="none"
              multiline={true}
              name="content"
              style={{
                flex: 1,
              }}
            />
            <Button
              onClick={onClickSend}
              startIcon={<SendIcon />}
              style={{ marginLeft: theme.spacing(2) }}
            >
            Envoyer
            </Button>
          </BottomBar>
        </>
      )}
    </Container>
  )
}
