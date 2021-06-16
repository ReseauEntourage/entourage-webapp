import React from 'react'
import { Avatar } from 'src/components/Avatar'
import * as S from './ConversationItem.styles'

interface ConversationItemProps {
  excerpt: string | JSX.Element;
  isActive: boolean;
  profilePictureURL?: string;
  title: string;
  hasUnreadMessages: boolean;
}

export function ConversationItem(props: ConversationItemProps) {
  const { excerpt, profilePictureURL, title, isActive, hasUnreadMessages } = props

  return (
    <S.Container isActive={isActive}>
      <S.ConversationContainer>
        <S.Picture>
          <Avatar alt="Profile" src={profilePictureURL || null} />
        </S.Picture>
        <S.Texts>
          <S.Title>{title}</S.Title>
          <S.Excerpt hasUnreadMessages={hasUnreadMessages}>{excerpt}</S.Excerpt>
        </S.Texts>
      </S.ConversationContainer>
      {
        hasUnreadMessages && <S.Dot />
      }
    </S.Container>
  )
}
