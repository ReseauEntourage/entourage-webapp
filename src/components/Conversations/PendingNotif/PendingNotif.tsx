import React from 'react'
import { Avatar } from 'src/components/Avatar'
import * as S from './PendingNotif.styles'

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
      <S.AvatarContainer>
        <S.FirstAvatar borderColor="white" src={pictureURL[0]} />
        <S.SecondAvatar borderColor="white" src={pictureURL[1]} />
      </S.AvatarContainer>
    ) : <Avatar borderColor="white" src={pictureURL} />

  return (
    <S.Container style={style}>
      {avatar}
      {label && (
        <S.Label>
          {label}
        </S.Label>
      )}
      <S.FlexGrow />
      {rightContent}
    </S.Container>
  )
}
