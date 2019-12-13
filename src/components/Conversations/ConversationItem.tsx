import React from 'react'
import { Container, Picture, NoProfilePicture, Texts, Title, Excerpt } from './ConversationItem.styles'

interface ConversationItemProps {
  excerpt: string;
  isActive: boolean;
  profilePictureURL?: string;
  title: string;
}

export function ConversationItem(props: ConversationItemProps) {
  const { excerpt, profilePictureURL, title, isActive } = props

  return (
    <Container isActive={isActive}>
      <Picture>
        {profilePictureURL ? (
          <img alt="Profile" src={profilePictureURL} />
        ) : (
          <NoProfilePicture />
        )}
      </Picture>
      <Texts>
        <Title>{title}</Title>
        <Excerpt>{excerpt}</Excerpt>
      </Texts>
    </Container>
  )
}
