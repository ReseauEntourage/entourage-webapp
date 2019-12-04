import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { variants } from 'src/styles'
import { Container, OwnerContainer, StarBadge, ParnerContainer } from './UsersItem.styles'

export interface UserItemProps {
  isOwner: boolean;
  isPartner: boolean;
  partnerName?: string;
  profilePictureURL: string;
  userId: string;
  userName: string;
}

export function UserItem(props: UserItemProps) {
  const { profilePictureURL, userName, isPartner, partnerName, isOwner } = props
  return (
    <Container>
      <Box m={1} position="relative" style={{ padding: 3 }}>
        <Avatar alt={userName} src={profilePictureURL} />
        {isPartner && (
          <StarBadge />
        )}
      </Box>
      <Box>
        <Typography variant={variants.bodyBold}>
          {userName}
          {partnerName && (
            <ParnerContainer>&nbsp;- {partnerName}</ParnerContainer>
          )}
        </Typography>
      </Box>
      <Box flexGrow="1" />
      {isOwner && (
        <OwnerContainer>
          Créateur
        </OwnerContainer>
      )}
    </Container>
  )
}
