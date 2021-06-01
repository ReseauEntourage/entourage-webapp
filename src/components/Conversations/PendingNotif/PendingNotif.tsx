import React, { useCallback } from 'react'
import { Avatar } from 'src/components/Avatar'
import { Link } from 'src/components/Link'
import { openModal } from 'src/components/Modal'
import { ModalUserCard } from 'src/containers/ModalUserCard'
import * as S from './PendingNotif.styles'

interface PendingNotifProps {
  label?: string | JSX.Element;
  pictureURL?: string | [string, string];
  rightContent?: JSX.Element;
  style?: React.CSSProperties;
  userId?: number;
}

export function PendingNotif(props: PendingNotifProps) {
  const { label, pictureURL, rightContent, style, userId } = props

  const avatar = Array.isArray(pictureURL)
    ? (
      <S.AvatarContainer>
        <S.FirstAvatar borderColor="white" src={pictureURL[0]} />
        <S.SecondAvatar borderColor="white" src={pictureURL[1]} />
      </S.AvatarContainer>
    ) : <Avatar borderColor="white" src={pictureURL} />

  const openUserModal = useCallback(() => {
    if (userId) {
      openModal(<ModalUserCard userId={userId} />)
    }
  }, [userId])

  return (
    <S.Container style={style}>
      <Link onClick={openUserModal}>
        {avatar}
      </Link>
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
