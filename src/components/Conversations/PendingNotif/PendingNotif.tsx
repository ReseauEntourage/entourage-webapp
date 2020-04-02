import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { Container, Label, FlexGrow } from './PendingNotif.styles'

interface PendingNotifProps {
  label?: string | JSX.Element;
  pictureURL?: string | [string, string];
  rightContent?: JSX.Element;
  style?: React.CSSProperties;
}

export function PendingNotif(props: PendingNotifProps) {
  const { label, pictureURL, rightContent, style } = props

  const avatarMultipleStyles: React.CSSProperties = {
    position: 'absolute',
    width: 24,
    height: 24,
  }

  const avatar = Array.isArray(pictureURL)
    ? (
      <div style={{ width: 36, height: 36, position: 'relative' }}>
        <Avatar borderColor="white" src={pictureURL[0]} style={{ ...avatarMultipleStyles, top: 0, right: 0 }} />
        <Avatar borderColor="white" src={pictureURL[1]} style={{ ...avatarMultipleStyles, left: 0, bottom: 0 }} />
      </div>
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
