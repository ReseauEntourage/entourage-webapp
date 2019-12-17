import SendIcon from '@material-ui/icons/Send'
// @ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom'
import React, { useCallback } from 'react'
import { Button } from 'src/components/Button'
import { Message } from 'src/components/Conversations'
import { TextField, useForm } from 'src/components/Form'
import {
  useQueryMe,
  useQueryEntourageChatMessages,
  useMutateCreateEntourageChatMessage,
  useQueryMyFeeds,
} from 'src/network/queries'
import { theme } from 'src/styles'
import {
  Container,
  MessagesContainer,
  BottomBar,
  TopBar,
  Pending,
} from './ConversationDetail.styles'

interface FormFields {
  content: string;
}

interface ConversationDetail {
  entourageId: number;
}

export function ConversationDetail(props: ConversationDetail) {
  const { entourageId } = props

  const { register, triggerValidation, getValues, setValue } = useForm<FormFields>()

  const { data: myFeedsData } = useQueryMyFeeds()
  const entourage = myFeedsData?.data.feeds.find((feed) => feed.data.id === entourageId)

  if (!entourage) {
    throw new Error(`Entourage "${entourageId}" is undefined`)
  }

  const { joinStatus } = entourage?.data || {}
  const userIsAccepted = joinStatus === 'accepted'

  if (joinStatus !== 'accepted' && joinStatus !== 'pending') {
    throw new Error(`Entourage with joins status ${joinStatus} shouldn't be in /myfeeds`)
  }

  const { data: chatMessages } = useQueryEntourageChatMessages(userIsAccepted ? entourageId : null)
  const [createcChatMessage] = useMutateCreateEntourageChatMessage(entourageId)
  const { data: meData } = useQueryMe()

  const onClickSend = useCallback(async () => {
    if (!await triggerValidation()) {
      return
    }

    await createcChatMessage({ content: getValues().content }, { waitForRefetchQueries: true })

    setValue('content', '')
  }, [createcChatMessage, getValues, setValue, triggerValidation])

  const messages = chatMessages?.data.chatMessages || []
  // must make a shallow copy because reverse() will mutate
  // and chatMessages is cached
  const reversedMessages = [...messages].reverse()

  return (
    <Container>
      <TopBar>
        {entourage?.data.title}
      </TopBar>
      {!userIsAccepted ? (
        <Pending>
          Votre demande est en attente. Lorsque vous serez accepté.e,
          vous verrez ici la conversation des participants à cette action/cet évènement.
        </Pending>
      ) : (
        <>
          <MessagesContainer>
            <ScrollToBottom className="ScrollToBottom" followButtonClassName="ScrollToBottomButton">
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
            </ScrollToBottom>
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
