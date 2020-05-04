import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { Container, Label, FlexGrow, FirstAvatar, SecondAvatar, AvatarContainer } from './PendingNotif.styles'

interface PendingNotifProps {
  label?: string | JSX.Element;
  pictureURL?: string | [string, string];
  rightContent?: JSX.Element;
  style?: React.CSSProperties;
}

export function PendingNotif(props: PendingNotifProps) {
  const { label, pictureURL, rightContent, style } = props

  const avatar = Array.isArray(pictureURL)
    ? (
      <AvatarContainer>
        <FirstAvatar borderColor="white" src={pictureURL[0]} />
        <SecondAvatar borderColor="white" src={pictureURL[1]} />
      </AvatarContainer>
    ) : <Avatar borderColor="white" src={pictureURL} />

  return (
    <Container style={style}>
      {avatar}
      {label && (
        <Label>
          {label}
        </Label>
      )}
      <FlexGrow />
      {rightContent}
    </Container>
  )
}
