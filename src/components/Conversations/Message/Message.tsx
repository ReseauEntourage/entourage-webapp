import { formatRelative } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { DateISO } from 'src/utils/types'
import {
  MessageContainer,
  Container,
  AvatarContainer,
  Content,
  Author,
  DateContainer,
} from './Message.styles'

interface MessageProps {
  author?: string;
  authorAvatarURL?: string | null;
  content: string;
  date: DateISO;
  isMe: boolean;
}

export function Message(props: MessageProps) {
  const { author, content, date, isMe, authorAvatarURL } = props

  const formatedContent = content.split('\n').map((str, index) => <div key={`${str + index}`}>{str}</div>)

  const dateLabel = formatRelative(new Date(date), new Date(), { locale: fr })

  return (
    <MessageContainer style={{ justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
      <Container>
        {!isMe && (
          <>
            <AvatarContainer>
              <Avatar src={authorAvatarURL} />
            </AvatarContainer>
            <Author>{author}</Author>
          </>
        )}
        <Content>{formatedContent}</Content>
        <DateContainer style={{ textAlign: isMe ? 'right' : 'left' }}>{dateLabel}</DateContainer>
      </Container>
    </MessageContainer>
  )
}
