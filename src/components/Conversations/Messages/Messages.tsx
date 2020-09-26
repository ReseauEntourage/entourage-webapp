import { useWatch } from 'react-hook-form'
import React, { useRef, useCallback, useEffect } from 'react'
import { Message } from '../Message'
import { useForm, TextField } from 'src/components/Form'
import { SendButton } from 'src/components/SendButton'
import { useOnScroll, usePrevious, useMount } from 'src/utils/hooks'
import * as S from './Messages.styles'

export interface MessageProps {
  fetchMore: () => void;
  meUserId: number;
  messages: {
    authorAvatarURL?: string | null;
    authorId: number;
    authorName: string;
    content: string;
    date: string;
    id: number;
  }[];
  onSendMessage: (message: string) => Promise<void>;
}

interface FormFields {
  content: string;
}

function useMessagesScroll(messages: MessageProps['messages'], fetchMore: MessageProps['fetchMore']) {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  const { onScroll, isAtBottom, isAtTop } = useOnScroll()

  const lastMessage = messages.length && messages[messages.length - 1]
  const prevLastMessage = usePrevious(lastMessage)
  const lastMessageHasChanged = lastMessage && prevLastMessage && lastMessage.id !== prevLastMessage.id

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messagesContainerRef])

  const isAtTopPrev = usePrevious(isAtTop)
  const fetchMoreIsNeeded = isAtTop && isAtTopPrev === false

  useMount(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  })

  useEffect(() => {
    if (fetchMoreIsNeeded) {
      fetchMore()
    }

    if (isAtBottom && lastMessageHasChanged) {
      scrollToBottom()
    }
  }, [fetchMore, fetchMoreIsNeeded, isAtBottom, lastMessageHasChanged, scrollToBottom])

  return {
    onScroll,
    messagesContainerRef,
  }
}

function useMessagesForm(onSendMessage: MessageProps['onSendMessage']) {
  const { register, getValues, setValue, trigger, control } = useForm<FormFields>()

  const content = useWatch({
    control,
    name: 'content',
    defaultValue: '',
  })

  const onSubmit = useCallback(async () => {
    if (!await trigger()) {
      return
    }

    onSendMessage(getValues().content)

    setValue('content', '')
  }, [getValues, onSendMessage, setValue, trigger])

  return {
    register,
    onSubmit,
    content,
  }
}

export function Messages(props: MessageProps) {
  const { messages, fetchMore, meUserId, onSendMessage } = props
  const { register, onSubmit, content } = useMessagesForm(onSendMessage)
  const { onScroll, messagesContainerRef } = useMessagesScroll(messages, fetchMore)

  return (
    <S.Container>
      <S.MessageList ref={messagesContainerRef} onScroll={onScroll}>
        {messages.map((message) => (
          <Message
            key={message.id}
            author={message.authorName}
            authorAvatarURL={message.authorAvatarURL}
            content={message.content}
            date={message.date}
            isMe={message.authorId === meUserId}
          />
        ))}
      </S.MessageList>
      <S.BottomBar>
        <TextField
          inputRef={register({ required: true })}
          margin="none"
          multiline={true}
          name="content"
          style={{
            flex: 1,
          }}
        />
        <SendButton disabled={content.length === 0} onClick={onSubmit} />
      </S.BottomBar>
    </S.Container>
  )
}
