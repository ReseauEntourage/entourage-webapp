import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React, { useCallback } from 'react'
import { Avatar } from 'src/components/Avatar'
import { variants } from 'src/styles'
import * as S from './UsersItem.styles'

export interface UserItemProps {
  isOwner: boolean;
  isPartner: boolean;
  onClick?: (userId: string) => void;
  partnerName?: string;
  profilePictureURL: string;
  userId: string;
  userName: string;
}

export function UserItem(props: UserItemProps) {
  const {
    profilePictureURL,
    userName,
    isPartner,
    partnerName,
    isOwner,
    userId,
    onClick: onClickProps,
  } = props

  const onClick = useCallback(() => {
    if (onClickProps) {
      onClickProps(userId)
    }
  }, [onClickProps, userId])

  return (
    <S.Container onClick={onClick}>
      <Box m={1} position="relative" style={{ padding: 3 }}>
        <Avatar alt={userName} src={profilePictureURL} />
        {isPartner && (
          <S.StarBadge />
        )}
      </Box>
      <Box>
        <Typography variant={variants.bodyBold}>
          {userName}
          {partnerName && (
            <S.ParnerContainer>&nbsp;- {partnerName}</S.ParnerContainer>
          )}
        </Typography>
      </Box>
      <Box flexGrow="1" />
      {isOwner && (
        <S.OwnerContainer>
          Créateur
        </S.OwnerContainer>
      )}
    </S.Container>
  )
}
