import { useWatch } from 'react-hook-form'
import React, { useRef, useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Message } from '../Message'
import { useForm, TextField } from 'src/components/Form'
import { SendButton } from 'src/components/SendButton'
import { messagesActions } from 'src/core/useCases/messages'
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

function valueIsDefined<T>(val: T): boolean {
  return val !== undefined && val !== null
}

function useMessagesScroll(messages: MessageProps['messages'], fetchMore: MessageProps['fetchMore']) {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const [scrollHeight, setScrollHeight] = useState(0)
  const [disableTopScrollDetection, setDisableTopScrollDetection] = useState(true)
  const [conversationHasChanged, setConversationHasChanged] = useState(true)

  const { onScroll, isAtBottom, isAtTop } = useOnScroll()

  const lastMessage = messages.length && messages[messages.length - 1]
  const prevLastMessage = usePrevious(lastMessage)
  const lastMessageHasChanged = lastMessage && prevLastMessage && lastMessage.id !== prevLastMessage.id

  const prevScrollHeight = usePrevious(scrollHeight)

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [])

  const isAtTopPrev = usePrevious(isAtTop)
  const fetchMoreIsNeeded = isAtTop && isAtTopPrev === false

  useMount(() => {
    setDisableTopScrollDetection(true)
    setConversationHasChanged(true)
  })

  useEffect(() => {
    if (messagesContainerRef.current) {
      setScrollHeight(messagesContainerRef.current.scrollHeight)
    }

    const hasFinishedChangingConversation = valueIsDefined(scrollHeight)
      && valueIsDefined(prevScrollHeight)
      && prevScrollHeight === 0
      && scrollHeight > 0

    if (hasFinishedChangingConversation) {
      setConversationHasChanged(false)
    }
  }, [messages, prevScrollHeight, scrollHeight])

  useEffect(() => {
    if (messagesContainerRef.current) {
      const hasFetchedOlderMessages = scrollHeight
        && prevScrollHeight
        && scrollHeight > prevScrollHeight
        && !disableTopScrollDetection
        && !conversationHasChanged

      if (scrollHeight && prevScrollHeight && hasFetchedOlderMessages) {
        messagesContainerRef.current.scrollTop = scrollHeight - prevScrollHeight
      }
    }
  }, [conversationHasChanged, disableTopScrollDetection, prevScrollHeight, scrollHeight])

  useEffect(() => {
    if (!conversationHasChanged) {
      scrollToBottom()
    }
  }, [conversationHasChanged, scrollToBottom])

  useEffect(() => {
    if (fetchMoreIsNeeded) {
      fetchMore()
    }

    if (isAtBottom) {
      setDisableTopScrollDetection(true)
    } else {
      setDisableTopScrollDetection(false)
    }

    if (isAtBottom && lastMessageHasChanged) {
      scrollToBottom()
    }
  }, [disableTopScrollDetection, fetchMore, fetchMoreIsNeeded, isAtBottom, lastMessageHasChanged, scrollToBottom])

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

    if (getValues().content.trim() === '') {
      return
    }

    await onSendMessage(getValues().content)

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
  const dispatch = useDispatch()

  const onKeyPress = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      await onSubmit()
    }
  }

  useMount(() => {
    const refreshMessages = setInterval(() => {
      dispatch(messagesActions.retrieveConversationMessages())
    }, 60 * 1e3)

    return () => clearTimeout(refreshMessages)
  })

  return (
    <S.Container>
      <S.MessageList ref={messagesContainerRef} onScroll={onScroll}>
        {messages.map((message) => (
          <Message
            key={message.id}
            author={message.authorName}
            authorAvatarURL={message.authorAvatarURL}
            authorId={message.authorId}
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
          onKeyPress={onKeyPress}
          style={{
            flex: 1,
          }}
        />
        <SendButton disabled={content.length === 0} onClick={onSubmit} />
      </S.BottomBar>
    </S.Container>
  )
}
