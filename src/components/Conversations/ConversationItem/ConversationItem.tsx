import Box from '@material-ui/core/Box'
import React from 'react'
import { Avatar } from 'src/components/Avatar'
import * as S from './ConversationItem.styles'

interface ConversationItemProps {
  excerpt: string | JSX.Element;
  isActive: boolean;
  profilePictureURL?: string;
  title: string;
}

export function ConversationItem(props: ConversationItemProps) {
  const { excerpt, profilePictureURL, title, isActive } = props

  return (
    <Box width="100%">
      <S.Container isActive={isActive}>
        <S.Picture>
          <Avatar alt="Profile" src={profilePictureURL || null} />
        </S.Picture>
        <S.Texts>
          <S.Title>{title}</S.Title>
          <S.Excerpt>{excerpt}</S.Excerpt>
        </S.Texts>
      </S.Container>
    </Box>
  )
}
