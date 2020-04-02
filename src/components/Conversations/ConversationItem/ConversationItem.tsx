import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { Container, Picture, Texts, Title, Excerpt } from './ConversationItem.styles'

interface ConversationItemProps {
  excerpt: string | JSX.Element;
  isActive: boolean;
  profilePictureURL?: string;
  title: string;
}

export function ConversationItem(props: ConversationItemProps) {
  const { excerpt, profilePictureURL, title, isActive } = props

  return (
    <Container isActive={isActive}>
      <Picture>
        <Avatar alt="Profile" src={profilePictureURL || null} />
      </Picture>
      <Texts>
        <Title>{title}</Title>
        <Excerpt>{excerpt}</Excerpt>
      </Texts>
    </Container>
  )
}
