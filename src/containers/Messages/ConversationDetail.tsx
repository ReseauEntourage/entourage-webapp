import SendIcon from '@material-ui/icons/Send'
// @ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom'
import React, { useCallback } from 'react'
import { Button } from 'src/components/Button'
import { Message } from 'src/components/ConversationsList'
import { TextField, useForm } from 'src/components/Form'
import {
  useQueryMe,
  useQueryEntourageChatMessages,
  useMutateCreateEntourageChatMessage,
} from 'src/network/queries'
import { theme } from 'src/styles'
import { Container, MessagesContainer, MessageContainer, MessageWrapper, BottomBar } from './ConversationDetail.styles'

interface FormFields {
  content: string;
}

interface ConversationDetail {
  entourageId: number;
}

export function ConversationDetail(props: ConversationDetail) {
  const { entourageId } = props

  const { register, triggerValidation, getValues, setValue } = useForm<FormFields>()

  const { data: chatMessages } = useQueryEntourageChatMessages(entourageId)
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
      <MessagesContainer>
        <ScrollToBottom className="ScrollToBottom" followButtonClassName="ScrollToBottomButton">
          {reversedMessages.map((message) => {
            const isMe = message.user.id === meData?.data.user.id
            return (
              <MessageContainer key={message.id} style={{ justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                <MessageWrapper>
                  <Message
                    author={message.user.displayName || undefined}
                    content={message.content}
                    date={message.createdAt}
                    isMe={isMe}
                  />
                </MessageWrapper>
              </MessageContainer>
            )
          })}
        </ScrollToBottom>
      </MessagesContainer>
      <BottomBar>
        <TextField
          inputRef={register({ required: true })}
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
    </Container>
  )
}
