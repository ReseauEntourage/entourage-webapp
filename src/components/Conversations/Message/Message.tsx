import { formatRelative } from 'date-fns' // eslint-disable-line
import { fr } from 'date-fns/locale' // eslint-disable-line
import React, { useCallback } from 'react'
import { Avatar } from 'src/components/Avatar'
import { Link } from 'src/components/Link'
import { openModal } from 'src/components/Modal'
import { ModalUserCard } from 'src/containers/ModalUserCard'
import { DateISO } from 'src/utils/types'
import * as S from './Message.styles'

interface MessageProps {
  author?: string;
  authorId: number;
  authorAvatarURL?: string | null;
  content: string;
  date: DateISO;
  isMe: boolean;
}

export function Message(props: MessageProps) {
  const { author, content, date, isMe, authorAvatarURL, authorId } = props

  const formatedContent = content.split('\n').map((str, index) => <div key={`${str + index}`}>{str}</div>)

  const dateLabel = formatRelative(new Date(date), new Date(), { locale: fr })

  const openUserModal = useCallback(() => {
    if (authorId) {
      openModal(<ModalUserCard userId={authorId} />)
    }
  }, [authorId])
  return (
    <S.MessageContainer style={{ justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
      <S.Container>
        {!isMe && (
          <>
            <S.AvatarContainer>
              <Link onClick={openUserModal}>
                <Avatar src={authorAvatarURL} />
              </Link>
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
