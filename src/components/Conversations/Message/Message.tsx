import { formatRelative } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { DateISO } from 'src/utils/types'
import * as S from './Message.styles'

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
    <S.MessageContainer style={{ justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
      <S.Container>
        {!isMe && (
          <>
            <S.AvatarContainer>
              <Avatar src={authorAvatarURL} />
            </S.AvatarContainer>
            <S.Author>{author}</S.Author>
          </>
        )}
        <S.Content>{formatedContent}</S.Content>
        <S.DateContainer style={{ textAlign: isMe ? 'right' : 'left' }}>{dateLabel}</S.DateContainer>
      </S.Container>
    </S.MessageContainer>
  )
}
